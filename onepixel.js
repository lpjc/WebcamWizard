/*
The onePixel library - 2020 version
moja@itu.dk
*/


// Add the style with transisiton to the HEAD
let h = document.getElementsByTagName('head').item(0);
let s = document.createElement("style");
s.type = "text/css"; 
s.appendChild(document.createTextNode(".toner{transition: background-color 0.5s linear;}"));
h.appendChild(s);



function onePixelDo(doFade, hue, sat, light) // hue is an angle between 0 and 360 ,  saturation and light is percentage
{
	let nextColor= new Chromath.hsl(hue, sat/100, light/100).toString();
	
	if(doFade)
	{
	document.body.classList.add("toner");
	}
	else
	{
	document.body.classList.remove("toner");
	}

	document.body.style.background = nextColor;
}

