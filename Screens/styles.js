import { StyleSheet } from 'react-native'

const buttons = StyleSheet.create({
    wealthsimpleButton: {
        backgroundColor: "rgba(124,183,182,0.4)",
        width: "80%",
        height: "100%",
        margin: 'auto',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    stockButton: {
        padding: 20,
        margin: 1,
        borderTopWidth: 1,
        borderColor: '#3D4B56',
        backgroundColor: '#759982',
        height: 80,
        borderRadius: 50,
        alignItems: 'flex-start',
        justifyContent: 'center',
    }
})

const text = StyleSheet.create({
    buttonText: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'FuturaPT-Book'
    } 
})

const inputBox = StyleSheet.create({
    textBox: {
      height: "10%",
      width: "80%",
      color: 'black',
      fontSize: 18,
      fontFamily: 'FuturaPT-Book'
    }
  });

export { buttons, text, inputBox}