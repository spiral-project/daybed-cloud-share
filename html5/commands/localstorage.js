function getLocalstorage() {
  console.log("hawkid", localStorage.getItem("cloud-share:hawkId"));
  console.log("hawkToken", localStorage.getItem("cloud-share:hawkSessionToken"));
  console.log("email", localStorage.getItem("cloud-share:email"));
  console.log("privateKey", localStorage.getItem("cloud-share:privateKey"));
  console.log("publicKey", localStorage.getItem("cloud-share:publicKey"));
}
getLocalstorage();
