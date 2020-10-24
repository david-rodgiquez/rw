import {
  LOGIN,
  login,
  userReducer,
  initialState,
} from '../../src/store/reducers/User';

describe('user reducer', () => {
  it('should create an action to store user info', () => {
    expect.assertions(1);
    const payload = { uid: '1', email: 'nightcrawler@xmen.com' };
    const expectedAction = {
      type: LOGIN,
      payload,
    };
    expect(login(payload)).toStrictEqual(expectedAction);
  });

  it('should return the initial state', () => {
    expect.assertions(1);
    expect(userReducer(undefined, {} as any)).toStrictEqual(initialState);
  });

  it('should store new user information', () => {
    expect.assertions(1);
    const payload = { uid: '2', email: 'gambit@xmen.com' };
    expect(
      userReducer(initialState, {
        type: LOGIN,
        payload,
      })
    ).toStrictEqual(payload);
  });
});
