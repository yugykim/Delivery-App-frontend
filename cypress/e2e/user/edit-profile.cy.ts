describe('Edit Profile', () => {
  const user = cy;
  beforeEach(() => {
    user.login("test@gmail.com", "Test123456")
    user.visit('/')
  })
  it("can go to /edit-profile using the header", () => {
    user.get('a[href="/edit-profile"]').click();
    user.title().should('eq', 'Edit Profile | Nuber Eats');
  });
  it("can change email", () => {
    user.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if(req.body.operationName === 'editProfile') {
        // overwritting
        // @ts-ignore
        req.body?.variables?.input?.email = 'test@gmail.com'; 
      }
    })
    user.visit('/edit-profile')
    user.findByPlaceholderText(/email/i).clear().type('new@nomadcoders.co')
    user.findByRole('button').click();
  })
})