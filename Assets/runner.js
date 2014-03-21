﻿#pragma strict
@System.NonSerialized
var board: Array;
@System.NonSerialized
var lost:boolean = false;
@System.NonSerialized
var time:double;
@System.NonSerialized
var score:int;
@System.NonSerialized
var timer:double;
@System.NonSerialized
var countDown:double;
var maxTime:int;
var maxScore:int;
var blackout:Texture;

function Start () {
	var rows:int;
	var cols:int;
	var index:int;
	score = 0;
	time = 0;
	timer = 2;
	countDown = 3;
	board = new Array(4);
	for(rows = 0; rows < 4; rows++) {
		index = Random.Range(0,4);
		board[rows] = new Array();
		for(cols = 0; cols < 4; cols++) {
			if(index == cols) {
				(board[rows] as Array)[cols] = 1;
			} else {
				(board[rows] as Array)[cols] = 0;
			}
		}
	}
}

function OnGUI () {
	if(lost) {
		GUI.backgroundColor.a = 0;
		if (timer <= 0 && Event.current.type == EventType.KeyDown)
			lose();
		var endResult = "You lost!";
		if(maxTime > 0 && time > maxTime || maxScore > 0 && score >= maxScore)
			endResult = "You win!";
		if(GUI.Button(Rect(0,0,Screen.width,Screen.height), endResult + "\nScore: " + score + "\nTime: " +
		Mathf.Round(time*1000)/1000 + " seconds.\nTiles per second: " + Mathf.Round(score/time*100)/100))
			lose();
	} else if(countDown > 0) {
		GUI.color.a = 0;
		GUI.backgroundColor.a = 0;
		GUI.Box(Rect(Screen.width/2, Screen.height/2, 50, 50), "" + Mathf.Round(countDown));
	} else {
		var rows:int;
		var cols:int;
		for(rows = 0; rows < board.length; rows++) {
			for(cols = 0; cols < 4; cols++) {
				if((board[rows] as Array)[cols] == 1) {
					GUI.color = Color.black;
					GUI.backgroundColor = Color.black;
					if(GUI.Button(Rect(Screen.width/4*cols, Screen.height/4*(3-rows),Screen.width/(4), Screen.height/4),""))
						if(rows == 0) {
							generateNext();
						}
				} else {
					GUI.color = Color.white;
					GUI.backgroundColor = Color.white;
					if(GUI.Button(Rect(Screen.width/4*cols, Screen.height/4*(3-rows),Screen.width/(4), Screen.height/4),""))
						if(rows == 0)
							lost = true;
				}
			}
		}
	}
}

function generateNext() {
	board.shift();
	score++;
	if(maxScore > 0 && score + 3 >= maxScore)
		return;
	var col:int;
	board[3] = new Array(4);
	var index = Random.Range(0,4);
	for(col = 0; col < 4; col++) {
		if(index == col) {
			(board[3] as Array)[col] = 1;
		} else {
			(board[3] as Array)[col] = 0;
		}
	}
}

function check(i:int) {
	if((board[0] as Array)[i] == 1) {
		generateNext();
	} else {
		lost = true;
	}
}

function lose() {
	Application.LoadLevel(0);
}

function Update () {
	if(countDown > 0) {
		countDown -= Time.deltaTime;
	} else if(!lost) {
		time += Time.deltaTime;
		if(Input.GetKeyDown(KeyCode.Z))
			check(0);
		if(Input.GetKeyDown(KeyCode.X))
			check(1);
		if(Input.GetKeyDown(KeyCode.C))
			check(2);
		if(Input.GetKeyDown(KeyCode.V))
			check(3);
	} else {
		timer -= Time.deltaTime;
	}
	if(maxTime > 0 && time > maxTime || maxScore > 0 && score >= maxScore)
		lost = true;
}