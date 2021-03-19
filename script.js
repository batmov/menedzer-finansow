let List = document.getElementById("list");
let ListWindow = document.getElementById("list-window");
let EditWindow = document.getElementById("edit-window");
let SettingsWindow = document.getElementById("settings-window");
let ListWindowButtons = document.getElementById("list-window-buttons");
let EditWindowButtons = document.getElementById("edit-window-buttons");
let BalanceMeter = document.getElementById("balance-meter");
let TitleArray = ["Wydatek", "Przychód"];
let DescriptionArray = ["Mój wydatek", "Mój przychód"];
let TypeArray = [1, 0];
let ValueArray = [300, 100];
let CreatedDateArray = ["19 mar 2021", "18 mar 2021"];
let Currency = "zł";
let EditItemTitle = document.getElementById("edit-item-title");
let EditItemDescription = document.getElementById("edit-item-desc");
let EditItemValue = document.getElementById("edit-item-value");
let EditItemIncome = document.getElementById("income");
let EditItemExpense = document.getElementById("expense");
let CurrentIndex = 0;
let d = new Date();
let Months = [
    "sty",
    "lut",
    "mar",
    "kwi",
    "cze",
    "lip",
    "sie",
    "wrz",
    "paź",
    "lis",
    "gru"
]

function Main() {
    if (getCookie("title-array") == null) SaveToCookies();
    LoadFromCookies();
    SwitchToPane(ListWindow);
}

function EditItem(index) {
    SwitchToPane(EditWindow);
    CurrentIndex = index;
    EditWindowButtons.children[1].style.display = "inline-block";
    EditWindowButtons.children[2].style.display = "none";
    EditWindowButtons.children[3].style.display = "inline-block";
    EditItemTitle.value = TitleArray[index];
    EditItemDescription.value = DescriptionArray[index];
    EditItemValue.value = ValueArray[index];
    if (TypeArray[index] == 1) EditItemIncome.checked = true;
    else EditItemExpense.checked = true;
}

function SaveItem() {
    let index = CurrentIndex;
    TitleArray[index] = EditItemTitle.value;
    DescriptionArray[index] = EditItemDescription.value;
    ValueArray[index] = EditItemValue.value;
    if (EditItemExpense.checked) TypeArray[index] = 0;
    else TypeArray[index] = 1;
    SwitchToPane(ListWindow);
}

function CreateItem() {
    EditWindowButtons.children[1].style.display = "none";
    EditWindowButtons.children[2].style.display = "inline-block";
    EditWindowButtons.children[3].style.display = "none";
    EditItemTitle.value = "";
    EditItemDescription.value = "";
    EditItemValue.value = "";
    EditItemIncome.checked = true;
    EditItemExpense.checked = false;
    SwitchToPane(EditWindow);
}

function DeleteItem() {
    CreatedDateArray.pop(CurrentIndex);
    DescriptionArray.pop(CurrentIndex);
    TitleArray.pop(CurrentIndex);
    ValueArray.pop(CurrentIndex);
    TypeArray.pop(CurrentIndex);
    SwitchToPane(ListWindow);
}

function EndCreateItem() {
    if (EditItemTitle.value != "" && EditItemValue.value != "") {
        TitleArray.unshift(EditItemTitle.value);
        if (EditItemDescription.value != "") DescriptionArray.unshift(EditItemDescription.value);
        else DescriptionArray.unshift("Brak opisu");
        ValueArray.unshift(EditItemValue.value);
        if (EditItemExpense.checked) TypeArray.unshift("0");
        else TypeArray.unshift("1");
        CreatedDateArray.unshift(
            d.getDate() + " " + Months[d.getMonth()] + " " + d.getFullYear()
        );
        SwitchToPane(ListWindow);
    }
}

function SwitchToPane(pane) {
    ListWindow.style.display = "none";
    EditWindow.style.display = "none";
    SettingsWindow.style.display = "none";
    pane.style.display = "block";
    RefreshList();
}

function RefreshList() {
    List.innerHTML = "";
    let date = "";
    let olddate = "";
    let sum = 0;
    for (let i = 0; i < TitleArray.length - 1; i++) {
        olddate = date;
        date = CreatedDateArray[i];
        let title = document.createElement("p");
        let desc = document.createElement("p");
        let value = document.createElement("p");
        let item = document.createElement("div");
        let timestamp = document.createElement("div");
        
        if (olddate != date) {
            timestamp.innerText = CreatedDateArray[i];
            timestamp.className = "timestamp";
            List.appendChild(timestamp);
        }

        if (TypeArray[i] == 1) {
            value.innerText = "+";
            value.className = "value income";
        } else {
            value.innerText = "-";
            value.className = "value expense";
        }

        title.className = "title";
        desc.className = "desc";

        title.innerText = TitleArray[i].toUpperCase();
        desc.innerText = DescriptionArray[i];
        value.innerText += ValueArray[i] + " " + Currency;

        item.className = "item";
        item.onclick = function(){EditItem(i)};
        item.appendChild(title);
        item.appendChild(desc);
        item.appendChild(value);

        List.appendChild(item);

        if (TypeArray[i] == 0) sum -= parseFloat(ValueArray[i]);
        else sum += parseFloat(ValueArray[i]);
    }
    console.log(sum);
    BalanceMeter.innerText = sum;
    if (BalanceMeter.innerText.charAt(0) == '-') BalanceMeter.className = "expense";
    else BalanceMeter.className = "positive";
    if (TitleArray.length == 1) {
        List.innerHTML = "<center>Twoje konto jest puste</center>";
    }
    SaveToCookies();
}

function SaveToCookies() {
    setCookie("title-array", TitleArray, 999999999);
    setCookie("desc-array", DescriptionArray, 999999999);
    setCookie("type-array", TypeArray, 999999999);
    setCookie("value-array", ValueArray, 999999999);
    setCookie("crdat-array", CreatedDateArray, 999999999);
}

function LoadFromCookies() {
    TitleArray = getCookie("title-array").split(",");
    DescriptionArray = getCookie("desc-array").split(",");
    TypeArray = getCookie("type-array").split(",");
    ValueArray = getCookie("value-array").split(",");
    CreatedDateArray = getCookie("crdat-array").split(",");
}

function setCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/; Max-Age=999999999999";
}

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

Main();