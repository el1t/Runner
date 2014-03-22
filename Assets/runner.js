#pragma strict
import System.IO;

@System.NonSerialized
var board: int[];
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
@System.NonSerialized
var paused:boolean;
@System.NonSerialized
var scores:float[];

var maxTime:int;
var maxScore:int;
var skin:GUISkin;
var rock_textures:Texture[];

function Start () {
	var row:int;
	var col:int;
	var index:int;
	paused = false;
	score = 0;
	time = 0;
	timer = .25;
	countDown = 2.5;
	board = new int[16];
	for(row = 0; row < 4; row++) {
		index = Random.Range(0, 4);
		for(col = 0; col < 4; col++) {
			if(index == col) {
				board[row*4 + col] = Random.Range(1, rock_textures.Length);
			} else {
				board[row*4 + col] = 0;
			}
		}
	}
	
	// build highscores
	scores = new float[10];
	var sr = new StreamReader(Application.dataPath + "/" + "scores.txt");
	var temp = sr.ReadToEnd().Split("\n"[0]);
	sr.Close();

	for(var i = 0; i < temp.Length; i++) {
		if(temp[i] == "")
			break;
		scores[i] = parseFloat(temp[i]);
		if(i > 0 && scores[i] < scores[i - 1] && scores[i] > 0 || scores[i] < 0) {
			scores = new float[10];
			break;
		}
	}
}

function OnGUI () {
	// default UI (for menu, not gameplay)
	GUI.skin = skin;
	GUI.backgroundColor.a = 0;

	// game over
	if(lost) {
		if (timer <= 0 && Event.current.type == EventType.KeyDown)
			exit();
		var endResult = "Melted!";
		if(maxTime > 0 && time >= maxTime || maxScore > 0 && score >= maxScore)
			endResult = "Finish!\nScore: " + score + "\nTime: " +
				Mathf.Round(time*1000)/1000 + " seconds.\nTiles per second: " + Mathf.Round(score/time*100)/100;
		if(GUI.Button(Rect(0, 0, Screen.width, Screen.height/2), endResult ))
			exit();

		// high scores
		for(var i = 0; i < 10; i++)
			GUI.Box(Rect(0, Screen.height/2 + Screen.height/20*i, Screen.width, Screen.height/20), i+1 + ": " + Mathf.Round(scores[i]*1000)/1000);

	// game beginning
	} else if(countDown > 0)
		GUI.Button(Rect(0, 0, Screen.width, Screen.height), "" + Mathf.Round(countDown+.5));

	else if(paused) {
		if(GUI.Button(Rect(0, 0, Screen.width, Screen.height),"Resume"))
			paused = !paused;

	// display game tiles
	} else {
		GUI.backgroundColor.a = 1;
		var row:int;
		var col:int;
		for(row = 0; row < 4; row++) {
			for(col = 0; col < 4; col++) {
				// black block
				if(board[row*4 + col] > 0) {
					if(GUI.Button(Rect(Screen.width/4*col, Screen.height/4*(3-row), Screen.width/(4), Screen.height/4), rock_textures[board[row*4 + col]]))
						check(col);

				// placeholder block
				} else if(board[row*4] == -1) {
					GUI.backgroundColor.a = 0;
					if(GUI.Button(Rect(Screen.width/4*col, Screen.height/4*(3-row), Screen.width/(4), Screen.height/4), ""))
						check(col);

				// white block
				} else if(GUI.Button(Rect(Screen.width/4*col, Screen.height/4*(3-row), Screen.width/(4), Screen.height/4), ""))
						check(col);
			}
		}
	}
}

function generateNext() {
	var index:int;
	for(index = 0; index < board.Length; index++) {
		if(index + 4 < board.Length)
			board[index] = board[index + 4];
		else if(board[index] == -1)
			break;
		else
			board[index] = -1;
	}
	score++;
	// do not generate if at end
	if(maxScore > 0 && score + 3 >= maxScore)
		return;

	// generate new tiles
	var col:int;
	index = Random.Range(0, 4);
	for(col = 0; col < 4; col++) {
		if(index == col) {
			board[12 + col] = Random.Range(1, rock_textures.Length);
		} else {
			board[12 + col] = 0;
		}
	}
}

function check(i:int) {
	if(board[i] > 0)
		generateNext();
	else
		lost = true;
}

function exit() {
	// writeout highscores
	var sw : StreamWriter = new StreamWriter ( Application.dataPath + "/" + "scores.txt" );
	for(i in scores) {
		if(i == 0)
			break;
		sw.WriteLine(i);
	}
	sw.Close();
	WaitForSeconds(1);
	Application.LoadLevel(0);
}

function Update () {
	if(countDown > 0)
		countDown -= Time.deltaTime;
	else if(paused && Input.GetKeyDown(KeyCode.Escape))
		paused = !paused;
	else if(!lost) {
		time += Time.deltaTime;

		if(maxTime > 0 && time >= maxTime || maxScore > 0 && score >= maxScore) {
			lost = true;
	
			// update highscore
			var appended:double = time;
			var temp:double;
			for(var i = 0; i < 10; i++) {
				if(appended < scores[i] || scores[i] == 0) {
					temp = appended;
					appended = scores[i];
					scores[i] = temp;
				}
				if(appended == 0)
					return;
			}
			return;
		}

		// keypresses
		if(Input.GetKeyDown(KeyCode.Z))
			check(0);
		if(Input.GetKeyDown(KeyCode.X))
			check(1);
		if(Input.GetKeyDown(KeyCode.C))
			check(2);
		if(Input.GetKeyDown(KeyCode.V))
			check(3);
		if(Input.GetKeyDown(KeyCode.F))
			check(0);
		if(Input.GetKeyDown(KeyCode.G))
			check(1);
		if(Input.GetKeyDown(KeyCode.H))
			check(2);
		if(Input.GetKeyDown(KeyCode.J))
			check(3);
		if(Input.GetKeyDown(KeyCode.Space))
			generateNext();
		if(Input.GetKeyDown(KeyCode.Escape))
			paused = !paused;

	} else
		timer -= Time.deltaTime;
}