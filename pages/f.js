fetch(`https://interclip.app/includes/api?url=${text}`)
.then((rs) => {
  if (rs.ok) {
    return rs.json();
  } else {
    if (rs.status === 429) {
      Alert.alert("Slow down!", "We are getting too many requests from you.");
    } else {
      Alert.alert("Error!", `Got the erorr ${rs.status}.`);
    }
  }
})
.then((objson) => setData(objson))
