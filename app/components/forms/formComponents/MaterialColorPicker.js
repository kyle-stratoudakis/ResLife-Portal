import React, { Component } from 'react';
import * as Colors from 'material-ui/styles/colors';

var red = [
	{red300: Colors.red300},
	{red400: Colors.red400},
	{red500: Colors.red500},
	{red600: Colors.red600},
	{red700: Colors.red700},
	{red800: Colors.red800},
	{red900: Colors.red900},
	{redA200: Colors.redA200},
	{redA400: Colors.redA400},
	{redA700: Colors.redA700}
]

var pink = [
	{pink300: Colors.pink300},
	{pink400: Colors.pink400},
	{pink500: Colors.pink500},
	{pink600: Colors.pink600},
	{pink700: Colors.pink700},
	{pink800: Colors.pink800},
	{pink900: Colors.pink900},
	{pinkA200: Colors.pinkA200},
	{pinkA400: Colors.pinkA400},
	{pinkA700: Colors.pinkA700}
]

var purple = [
	{purple300: Colors.purple300},
	{purple400: Colors.purple400},
	{purple500: Colors.purple500},
	{purple600: Colors.purple600},
	{purple700: Colors.purple700},
	{purple800: Colors.purple800},
	{purple900: Colors.purple900},
	{purpleA200: Colors.purpleA200},
	{purpleA400: Colors.purpleA400},
	{purpleA700: Colors.purpleA700}
]

var deepPurple = [
	{deepPurple300: Colors.deepPurple300},
	{deepPurple400: Colors.deepPurple400},
	{deepPurple500: Colors.deepPurple500},
	{deepPurple600: Colors.deepPurple600},
	{deepPurple700: Colors.deepPurple700},
	{deepPurple800: Colors.deepPurple800},
	{deepPurple900: Colors.deepPurple900},
	{deepPurpleA200: Colors.deepPurpleA200},
	{deepPurpleA400: Colors.deepPurpleA400},
	{deepPurpleA700: Colors.deepPurpleA700}
]

var indigo = [
	{indigo300: Colors.indigo300},
	{indigo400: Colors.indigo400},
	{indigo500: Colors.indigo500},
	{indigo600: Colors.indigo600},
	{indigo700: Colors.indigo700},
	{indigo800: Colors.indigo800},
	{indigo900: Colors.indigo900},
	{indigoA200: Colors.indigoA200},
	{indigoA400: Colors.indigoA400},
	{indigoA700: Colors.indigoA700}
]

var blue = [
	{blue300: Colors.blue300},
	{blue400: Colors.blue400},
	{blue500: Colors.blue500},
	{blue600: Colors.blue600},
	{blue700: Colors.blue700},
	{blue800: Colors.blue800},
	{blue900: Colors.blue900},
	{blueA200: Colors.blueA200},
	{blueA400: Colors.blueA400},
	{blueA700: Colors.blueA700}
]

var lightBlue = [
	{lightBlue300: Colors.lightBlue300},
	{lightBlue400: Colors.lightBlue400},
	{lightBlue500: Colors.lightBlue500},
	{lightBlue600: Colors.lightBlue600},
	{lightBlue700: Colors.lightBlue700},
	{lightBlue800: Colors.lightBlue800},
	{lightBlue900: Colors.lightBlue900},
	{lightBlueA200: Colors.lightBlueA200},
	{lightBlueA400: Colors.lightBlueA400},
	{lightBlueA700: Colors.lightBlueA700}
]

var cyan = [
	{cyan300: Colors.cyan300},
	{cyan400: Colors.cyan400},
	{cyan500: Colors.cyan500},
	{cyan600: Colors.cyan600},
	{cyan700: Colors.cyan700},
	{cyan800: Colors.cyan800},
	{cyan900: Colors.cyan900},
	{cyanA200: Colors.cyanA200},
	{cyanA400: Colors.cyanA400},
	{cyanA700: Colors.cyanA700}
]

var teal = [
	{teal300: Colors.teal300},
	{teal400: Colors.teal400},
	{teal500: Colors.teal500},
	{teal600: Colors.teal600},
	{teal700: Colors.teal700},
	{teal800: Colors.teal800},
	{teal900: Colors.teal900},
	{tealA200: Colors.tealA200},
	{tealA400: Colors.tealA400},
	{tealA700: Colors.tealA700}
]

var green = [
	{green300: Colors.green300},
	{green400: Colors.green400},
	{green500: Colors.green500},
	{green600: Colors.green600},
	{green700: Colors.green700},
	{green800: Colors.green800},
	{green900: Colors.green900},
	{greenA200: Colors.greenA200},
	{greenA400: Colors.greenA400},
	{greenA700: Colors.greenA700}
]

var lightGreen = [
	{lightGreen300: Colors.lightGreen300},
	{lightGreen400: Colors.lightGreen400},
	{lightGreen500: Colors.lightGreen500},
	{lightGreen600: Colors.lightGreen600},
	{lightGreen700: Colors.lightGreen700},
	{lightGreen800: Colors.lightGreen800},
	{lightGreen900: Colors.lightGreen900},
	{lightGreenA200: Colors.lightGreenA200},
	{lightGreenA400: Colors.lightGreenA400},
	{lightGreenA700: Colors.lightGreenA700}
]

var lime = [
	{lime300: Colors.lime300},
	{lime400: Colors.lime400},
	{lime500: Colors.lime500},
	{lime600: Colors.lime600},
	{lime700: Colors.lime700},
	{lime800: Colors.lime800},
	{lime900: Colors.lime900},
	{limeA200: Colors.limeA200},
	{limeA400: Colors.limeA400},
	{limeA700: Colors.limeA700}
]

var yellow = [
	{yellow300: Colors.yellow300},
	{yellow400: Colors.yellow400},
	{yellow500: Colors.yellow500},
	{yellow600: Colors.yellow600},
	{yellow700: Colors.yellow700},
	{yellow800: Colors.yellow800},
	{yellow900: Colors.yellow900},
	{yellowA200: Colors.yellowA200},
	{yellowA400: Colors.yellowA400},
	{yellowA700: Colors.yellowA700}
]

var amber = [
	{amber300: Colors.amber300},
	{amber400: Colors.amber400},
	{amber500: Colors.amber500},
	{amber600: Colors.amber600},
	{amber700: Colors.amber700},
	{amber800: Colors.amber800},
	{amber900: Colors.amber900},
	{amberA200: Colors.amberA200},
	{amberA400: Colors.amberA400},
	{amberA700: Colors.amberA700}
]

var orange = [
	{orange300: Colors.orange300},
	{orange400: Colors.orange400},
	{orange500: Colors.orange500},
	{orange600: Colors.orange600},
	{orange700: Colors.orange700},
	{orange800: Colors.orange800},
	{orange900: Colors.orange900},
	{orangeA200: Colors.orangeA200},
	{orangeA400: Colors.orangeA400},
	{orangeA700: Colors.orangeA700}
]

var deepOrange = [
	{deepOrange300: Colors.deepOrange300},
	{deepOrange400: Colors.deepOrange400},
	{deepOrange500: Colors.deepOrange500},
	{deepOrange600: Colors.deepOrange600},
	{deepOrange700: Colors.deepOrange700},
	{deepOrange800: Colors.deepOrange800},
	{deepOrange900: Colors.deepOrange900},
	{deepOrangeA200: Colors.deepOrangeA200},
	{deepOrangeA400: Colors.deepOrangeA400},
	{deepOrangeA700: Colors.deepOrangeA700}
]

var brown = [
	{brown300: Colors.brown300},
	{brown400: Colors.brown400},
	{brown500: Colors.brown500},
	{brown600: Colors.brown600},
	{brown700: Colors.brown700},
	{brown800: Colors.brown800},
	{brown900: Colors.brown900}
]

var blueGrey = [
	{blueGrey300: Colors.blueGrey300},
	{blueGrey400: Colors.blueGrey400},
	{blueGrey500: Colors.blueGrey500},
	{blueGrey600: Colors.blueGrey600},
	{blueGrey700: Colors.blueGrey700},
	{blueGrey800: Colors.blueGrey800},
	{blueGrey900: Colors.blueGrey900}
]

var grey = [
	{grey300: Colors.grey300},
	{grey400: Colors.grey400},
	{grey500: Colors.grey500},
	{grey600: Colors.grey600},
	{grey700: Colors.grey700},
	{grey800: Colors.grey800},
	{grey900: Colors.grey900}
]

var blackWhite = [
	{black: Colors.black},
	{white: Colors.white},
	{transparent: Colors.transparent},
	{fullBlack: Colors.fullBlack},
	{darkBlack: Colors.darkBlack},
	{lightBlack: Colors.lightBlack},
	{minBlack: Colors.minBlack},
	{faintBlack: Colors.faintBlack},
	{fullWhite: Colors.fullWhite},
	{darkWhite: Colors.darkWhite},
	{lightWhite: Colors.lightWhite}
]

class MaterialColorPicker extends Component {
	render() {
		return (
			{'MaterialColorPicker'}
		)
	}
}

export default FormWrapper(MaterialColorPicker);