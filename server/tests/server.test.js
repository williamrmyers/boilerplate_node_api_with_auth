const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {app} = require('./../server');
const {User} = require('./../models/user');

// Seed data to be used in tests.
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'william@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id:userTwoId,
  email: 'dave@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

// Populate DB
const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();


    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

// Testing Lifecycle Method
beforeEach(populateUsers);

describe('Get members route.', () => {
  it('Should get private route if authenticated.', (done) => {
    request(app)
      .get('/members')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end(done)
  });

  it('Should NOT get private route if un-authenticated.', (done) => {
    request(app)
      .get('/members')
      .expect(401)
      .end(done)
  });
});


// User Tests

describe('GET /users/me', () => {
  it('Should return user if authenticated.', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('Should return 401 if not authenticated.', (done) => {
  request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe(`POST to /users`, () => {
  it('should create a user.', (done) => {
    let email = 'example@example.com';
    let password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return end(done);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({ 'email': '122345678qwertyui', 'password': '123'})
      .expect(400)
      .end(done);
  });
  it('should not create user if email in use.', (done) => {
    request(app)
      .post('/users')
      .send({ email: users[0].email, password: users[0].password})
      .expect(400)
      .end(done);
  });
});

describe(`POST /users/login`, () => {
  it(`should login user and return auth token.`, (done) => {
    request(app)
    .post(`/users/login`)
    .send({ 'email': users[1].email, 'password': users[1].password })
    .expect(200)
    .expect((res) => {
      expect(res.header['x-auth']).toBeTruthy() ;
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findById( users[1]._id ).then((user) => {
        expect(user.toObject().tokens[1]).toMatchObject({
          access: 'auth',
          token: res.header['x-auth']
        });
        done()
      }).catch((e) => done(e));
    })
  });

  it(`should reject invalid login`, (done) => {
    request(app)
      .post(`/users/login`)
      .send({ 'email': users[1].email, 'password': '12345'})
      .expect(400)
      .expect((res) => {
        expect(res.header['x-auth']).toBeFalsy() ;
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById( users[1]._id ).then((user) => {
          expect(user.tokens.length).toBe(1);
          done()
        }).catch((e) => done(e));
      })
    });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout.', (done) => {
    request(app)
      .delete(`/users/me/token`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById( users[0]._id ).then((user) => {
          expect(user.tokens.length).toBe(0);
          done()
        }).catch((e) => done(e));
      });
  });
});
