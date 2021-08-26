function pageLoad() {
	document.getElementById("any").checked = true;
	document.getElementById("anySockets").checked = true;
	window.addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			event.returnValue=false;
			event.cancel=true;
			document.getElementById("getRwsBtn").click();
		}
	});
}



function SelectAllRunes(){
	var runeCheckBoxes = document.getElementsByClassName("rune");
	for (var i = runeCheckBoxes.length - 1; i >= 0; i--) {
		runeCheckBoxes[i].checked = true;
	}	
}

function DeselectAllRunes(){
	var runeCheckBoxes = document.getElementsByClassName("rune");
	for (var i = runeCheckBoxes.length - 1; i >= 0; i--) {
		runeCheckBoxes[i].checked = false;
	}	
}

function SelectAllArmor(){
	var armorCheckBoxes =  document.getElementsByClassName("armor");
	for (var i = armorCheckBoxes.length - 1; i >= 0; i--) {
		armorCheckBoxes[i].checked = true;
	}
}

function SelectAllWeapons(){
	var weaponCheckBoxes = document.getElementsByClassName("weapon");
	for (var i = weaponCheckBoxes.length - 1; i >= 0; i--) {
		weaponCheckBoxes[i].checked = true;
	}
}

function DeselectAllBases(){
	var armorCheckBoxes =  document.getElementsByClassName("armor");
	for (var i = armorCheckBoxes.length - 1; i >= 0; i--) {
		armorCheckBoxes[i].checked = false;
	}
	var weaponCheckBoxes = document.getElementsByClassName("weapon");
	for (var i = weaponCheckBoxes.length - 1; i >= 0; i--) {
		weaponCheckBoxes[i].checked = false;
	}
}

function getRws(){
	var	RWSet = document.getElementById("rwSet");
	var xmlSet = "";
	switch(RWSet.value){
		case "lod":
			xmlSet = "rw - base d2 lod.xml"
			break;
		case "d2r":
			xmlSet = "rw - d2r.xml"
			break;
		case "pd2S1":
			xmlSet = "rw - pd2 season 1.xml"
			break;
		case "pd2S2":
			xmlSet = "rw - pd2 season 2.xml"
			break;
		case "pd2S3":
			xmlSet = "rw - pd2 season 3.xml"
			break;
		default:
			alert("ERROR: Invalid RW Set Selected.");
			break;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200){
			formatResults(this);
		}
	};
	xhttp.open("GET", xmlSet, true);
	xhttp.send();
}

function formatResults(xml){
	var i;
	var xmlDoc = xml.responseXML;
	var table = "<tr><th>Name</th><th>Bases</th><th>Rune Order</th><th>Stats</th></tr>";
	var y = xmlDoc.getElementsByTagName("RuneWord");

	//maybe add a check for null return if errors out
	var x = strFilter(filterBySockets(filterByBase(filterByRunes(y))));

	// output results
	if(x.length == 0){
		table = "<tr><th>No Results Found Please Change Your Selections!</th></tr>"
	}
	for (var i = 0; i < x.length; i++) {
		var baseTypes = x[i].getElementsByTagName("BaseType");
		var runes = x[i].getElementsByTagName("Rune");
		var stats = x[i].getElementsByTagName("Stats");
		table +="<tr><td class=\"rwName\">" +
		x[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue + 
		"</td><td class=\"rwBases\">" +
		x[i].getElementsByTagName("BaseSockets")[0].childNodes[0].nodeValue + 
		" socket ";
		for (var j = 0; j < baseTypes.length; j++) {
			if(j > 0){
				table +=  " / ";
			}
			table += baseTypes[j].childNodes[0].nodeValue;
		}
		table += "</td><td class=\"rwRunes\">";
		for (var j = 0; j < runes.length; j++) {
			if(j > 0){
				table +=  " + ";
			}
			table += runes[j].childNodes[0].nodeValue;
		}
		table += "</td><td class=\"rwStats\">";

		for (var j = 0; j < stats.length; j++) {
			for (var k = 0; k < stats[j].children.length; k++) {
				table += stats[j].children[k].childNodes[0].nodeValue + 
				"<br />";
			}
		}

		table += "</td></tr>";
	}
	document.getElementById("results").innerHTML = table;
}
function strFilter(rwList){
	var filteredList = [];
	var z = 0;
	var searchStr = document.getElementById("strSearch").value.trim();

	if (searchStr != null && searchStr != "") {
		for (var i = 0; i < rwList.length; i++) {
			if (rwList[i].innerHTML.toLowerCase().search(searchStr.toLowerCase()) != -1) {
				filteredList[z] = rwList[i];
				z++;
			}
		}
	}
	else{
		filteredList = rwList;
	}
	return filteredList;
}
function filterBySockets(rwList){
	var filteredList = [];
	var z = 0;
	if(document.getElementById("anySockets").checked){
		filteredList = rwList;
	}else{
		for (var i = 0; i < rwList.length; i++) {
			var sockets = rwList[i].getElementsByTagName("BaseSockets")[0].childNodes[0].nodeValue.trim();
	 		if(document.getElementById("twoSockets").checked && sockets == 2){
					filteredList[z] = rwList[i];
					z++;
			}
			else if(document.getElementById("threeSockets").checked && sockets == 3){
					filteredList[z] = rwList[i];
					z++;
			}
			else if(document.getElementById("fourSockets").checked && sockets == 4){
					filteredList[z] = rwList[i];
					z++;
			}
			else if(document.getElementById("fiveSockets").checked && sockets == 5){
					filteredList[z] = rwList[i];
					z++;
			}
			else if(document.getElementById("sixSockets").checked && sockets == 6){
					filteredList[z] = rwList[i];
					z++;
			}
			
		}
	}
	return filteredList;
}
function filterByBase(rwList){
	var filteredList = [];
	var z = 0;
	var nextRW = false;

	for (var i = 0; i < rwList.length; i++) {
		nextRW = false;
		var base = rwList[i].getElementsByTagName("BaseType");
		for (var j = 0; j < base.length; j++) {
			if (!nextRW) {
				if(getBaseSelected(base[j].childNodes[0].nodeValue)){
					filteredList[z] = rwList[i];
					z++;
					nextRW = true;
				}
			}
		}
	}

	return filteredList;
}

function filterByRunes(rwList){
	var filteredList = [];
	var z = 0;
	var nextRW = false;
	if(document.getElementById("any").checked){
		for (var i = 0; i < rwList.length; i++) {
			nextRW = false;
			var runes = rwList[i].getElementsByTagName("Rune");
			for (var j = 0; j < runes.length; j++) {
				if (!nextRW) {
					if(getRunesSelected(runes[j].childNodes[0].nodeValue)){
						filteredList[z] = rwList[i];
						z++;
						nextRW = true;
					}
				}
			}
		}
	}else if(document.getElementById("only").checked){
		for (var i = 0; i < rwList.length; i++) {
			var runes = rwList[i].getElementsByTagName("Rune");
			var checkAllCount = 0;
			for (var j = 0; j < runes.length; j++) {
				if(getRunesSelected(runes[j].childNodes[0].nodeValue)){
					checkAllCount++;
				}
			}
			if(checkAllCount == runes.length){
				filteredList[z] = rwList[i];
				z++;
			}
		}
	}else if (document.getElementById("one")) {
		for (var i = 0; i < rwList.length; i++) {
			var runes = rwList[i].getElementsByTagName("Rune");
			var checkAllCount = 0;
			for (var j = 0; j < runes.length; j++) {
				if(getRunesSelected(runes[j].childNodes[0].nodeValue)){
					checkAllCount++;
				}
			}
			if(checkAllCount >= runes.length - 1){
				filteredList[z] = rwList[i];
				z++;
			}
		}
	}else {
		alert("ERROR: Some how you managed to not select a filter type.");
	}
	return filteredList;
}

function getRunesSelected(rune){

	if(document.getElementById("el").name == rune.toLowerCase()){
		if(!document.getElementById("el").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("eld").name == rune.toLowerCase()){
		if(!document.getElementById("eld").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("tir").name == rune.toLowerCase()){
		if(!document.getElementById("tir").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("nef").name == rune.toLowerCase()){
		if(!document.getElementById("nef").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("eth").name == rune.toLowerCase()){
		if(!document.getElementById("eth").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("ith").name == rune.toLowerCase()){
		if(!document.getElementById("ith").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("tal").name == rune.toLowerCase()){
		if(!document.getElementById("tal").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("ral").name == rune.toLowerCase()){
		if(!document.getElementById("ral").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("ort").name == rune.toLowerCase()){
		if(!document.getElementById("ort").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("thul").name == rune.toLowerCase()){
		if(!document.getElementById("thul").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("amn").name == rune.toLowerCase()){
		if(!document.getElementById("amn").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("sol").name == rune.toLowerCase()){
		if(!document.getElementById("sol").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("shael").name == rune.toLowerCase()){
		if(!document.getElementById("shael").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("dol").name == rune.toLowerCase()){
		if(!document.getElementById("dol").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("hel").name == rune.toLowerCase()){
		if(!document.getElementById("hel").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("io").name == rune.toLowerCase()){
		if(!document.getElementById("io").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("lum").name == rune.toLowerCase()){
		if(!document.getElementById("lum").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("ko").name == rune.toLowerCase()){
		if(!document.getElementById("ko").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("fal").name == rune.toLowerCase()){
		if(!document.getElementById("fal").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("lem").name == rune.toLowerCase()){
		if(!document.getElementById("lem").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("pul").name == rune.toLowerCase()){
		if(!document.getElementById("pul").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("um").name == rune.toLowerCase()){
		if(!document.getElementById("um").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("mal").name == rune.toLowerCase()){
		if(!document.getElementById("mal").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("ist").name == rune.toLowerCase()){
		if(!document.getElementById("ist").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("gul").name == rune.toLowerCase()){
		if(!document.getElementById("gul").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("vex").name == rune.toLowerCase()){
		if(!document.getElementById("vex").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("ohm").name == rune.toLowerCase()){
		if(!document.getElementById("ohm").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("lo").name == rune.toLowerCase()){
		if(!document.getElementById("lo").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("sur").name == rune.toLowerCase()){
		if(!document.getElementById("sur").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("ber").name == rune.toLowerCase()){
		if(!document.getElementById("ber").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("jah").name == rune.toLowerCase()){
		if(!document.getElementById("jah").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("cham").name == rune.toLowerCase()){
		if(!document.getElementById("cham").checked){
			return false;
		}else{
			return true;
		}
	}
	
	if(document.getElementById("zod").name == rune.toLowerCase()){
		if(!document.getElementById("zod").checked){
			return false;
		}else{
			return true;
		}
	}
	


	alert("ERROR: Invalid rune in xml file: " + rune);
	return false;
}

function getBaseSelected(base){

	if(base.toLowerCase().trim() == "body armor"){
		if(!document.getElementById("bodyArmor").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "shield"){
		if(!document.getElementById("shield").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "helmet"){
		if(!document.getElementById("helmet").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "circlet"){
		if(!document.getElementById("circlet").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "barbarian helmet"){
		if(!document.getElementById("barbHelm").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "druid pelt"){
		if(!document.getElementById("druidPelt").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "paladin shield"){
		if(!document.getElementById("pallyShield").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "necromancer shrunken head"){
		if(!document.getElementById("necroHead").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "sword"){
		if(!document.getElementById("sword").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "dagger"){
		if(!document.getElementById("dagger").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "axe"){
		if(!document.getElementById("axe").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "club"){
		if(!document.getElementById("club").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "mace"){
		if(!document.getElementById("mace").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "hammer"){
		if(!document.getElementById("hammer").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "scepter"){
		if(!document.getElementById("scepter").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "staff"){
		if(!document.getElementById("staff").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "wand"){
		if(!document.getElementById("wand").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "spear"){
		if(!document.getElementById("spear").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "polearm"){
		if(!document.getElementById("polearm").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "bow"){
		if(!document.getElementById("bow").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "crossbow"){
		if(!document.getElementById("crossbow").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "amazon bow"){
		if(!document.getElementById("zonBow").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "amazon spear"){
		if(!document.getElementById("zonSpear").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "assassin katar"){
		if(!document.getElementById("sinKatar").checked){
			return false;
		}else{
			return true;
		}
	}
	if(base.toLowerCase().trim() == "sorceress orb"){
		if(!document.getElementById("orb").checked){
			return false;
		}else{
			return true;
		}
	}

	
	alert("ERROR: Invalid base in xml file: " + base);
	return false;
}

