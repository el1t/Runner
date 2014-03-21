#pragma strict
@System.NonSerialized
var board: Array;

function Start () {
	var rows:int;
	var cols:int;
	var index:int;
	board = new Array();
	for(rows = 0; rows < 4; rows++) {
		index = Random.Range(1,4);
		board.push([]);
		for(cols = 0; cols < 4; cols++) {
			if(index == cols) {
				(board[rows] as Array)[cols] = 1;
			} else {
				(board[rows] as Array)[cols] = 0;
			}
		}
	}
	Debug.Log(board);
}

function OnGUI () {
	var rows:int;
	var cols:int;
	for(rows = 0; rows < 4; rows++) {
		for(cols = 0; cols < 4; cols++) {
			if((board[rows] as Array)[cols] == 1) {
				if(GUI.Button(Rect(Screen.width*(1-1/(cols+1)), Screen.height*(1-1/(rows+1)),Screen.width/(cols+1), Screen.height/(rows+1)),"BLACK"))
					generateNext();
			} else {
				if(GUI.Button(Rect(Screen.width*(1-1/(cols+1)), Screen.height*(1-1/(rows+1)),Screen.width/(cols+1), Screen.height/(rows+1)),"WHITE"))
					Debug.Log("Lost.");
			}
		}
	}
}

function generateNext() {
	board.shift();
	
}

function Update () {

}