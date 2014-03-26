#pragma strict
var skin:GUISkin;

function Start () {

}

function OnGUI () {
	GUI.skin = skin;
	GUI.skin.box.fontSize = Mathf.Min(Screen.width, Screen.height) / 4;
	GUI.skin.button.fontSize = Mathf.Min(Screen.width, Screen.height) / 30;
	GUI.Box(Rect(0,0,Screen.width,Screen.height / 4), "Runner");
	if(GUI.Button(Rect(0, Screen.height/4, Screen.width, Screen.height / 4), "Time Trial"))
		Application.LoadLevel("time");
	if(GUI.Button(Rect(0, Screen.height/2, Screen.width, Screen.height / 4), "Endurance"))
		Application.LoadLevel("long");
}

function Update () {

}