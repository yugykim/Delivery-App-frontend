describe('Edit Profile', () => {
  const user = cy;
  it("can go to /edit-profile using the header", () => {
    user.login("test@gmail.com", "Test123456");
    user.get('a[href="/edit-profile"]').click();
  })
})