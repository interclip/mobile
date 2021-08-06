import { Dimensions, StyleSheet } from "react-native";

// const entireScreenHeight = Dimensions.get("window").height;
const entireScreenWidth = Dimensions.get("window").width;

/* Styles */
const styles = StyleSheet.create({
  container: {
    alignItems: "center", // Centered horizontally
    justifyContent: "center",
    flex: 1,
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
  previewImg: {
    width: 100,
    height: 100,
    marginLeft: entireScreenWidth / 2 - 50,
    marginBottom: "20%",
  },
  aboutImg: {
    width: entireScreenWidth / 3,
    height: entireScreenWidth / 3,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "10%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  fileItem: {
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    marginTop: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 15,
  },
  openButton: { borderRadius: 20, padding: 10, elevation: 2, marginTop: 10 },
  textStyle: { color: "white", fontWeight: "bold", textAlign: "center" },
  modalText: { marginBottom: 15, textAlign: "center" },
  header: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
    width: "7%",
    height: 4,
    borderRadius: 4,
  },
});

export { styles };
