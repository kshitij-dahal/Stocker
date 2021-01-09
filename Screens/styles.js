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
        margin: 0.5,
        marginBottom: 4,
        borderColor: '#759982',
        backgroundColor: '#759982',
        height: 65,
        width: "100%",
        borderRadius: 17,
        justifyContent: 'center',
    },
    overViewButton: {
        backgroundColor: "rgba(124,183,182,0.4)",
        width: "100%",
        height: 70,
        marginTop: 10,
        padding: 20,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: 'space-between',
    },
})

const text = StyleSheet.create({
    buttonText: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'FuturaPT-Book'
    },
    stockDataSymbol: {
        color: 'white',
        fontSize: 32,
        fontFamily: 'FuturaPT-Book',
        textAlign: 'center'
    },
    stockDataName: {
        color: 'white',
        fontSize: 25,
        fontFamily: 'FuturaPT-Book',
        textAlign: "left"
    },
    stockDataAmount: {
        color: 'white',
        fontSize: 25,
        fontFamily: 'FuturaPT-Book',
        textAlign: "right"
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