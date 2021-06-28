$.fn.hierarchyDesigner = function (initData) {


//Default Load/Save Functions, Useful for reading to write your own
let defaults = {
	load: function() {
		//Default Load Data Function (Uses Browser LocalStorage)
		exampleLoad();
	},
	store: function() {
		//Default Save Data Function (Uses Browser LocalStorage)
		exampleSave();
	},
	initExtra: function() {
		//Extra Functionality
	},
	height:3000,
	width: 3000
}
let onStartup = false;
//Extending the Defaults
initData = $.extend({}, defaults, initData);
const ThisSelector = this.selector;
//Declaratives
let CompleteList = []; //Complete list of User Groups and Org Types
let GroupList = []; //User Groups
let LabelList = []; //Organization Types
let dragging; //Dragging Function
let dragok = false; //Are we dragging

let GlobalIDList = []; //List of all AlphaNumeric Identifiers 

let GlobalParentUser = "off"; //Capture Values for a User Check
let GlobalSourceUser = "off"; //Capture Values for a User Check

let taggingElement = undefined; //Capture Value for Tagging an Element

let offset = {x: 0, y: 0}; //Capture Values for Mouse Offset
let linking = false; //Are we trying to link an element?

let linkingBaseID = undefined; //Capture Value for Linking Paths

const FontAwesomeLicense = "https://fontawesome.com/license/free" //Credit for Vector Graphics Icon
const GlobalVersion = "1.0.0";

let svg; //Global SVG Element
let uiSVG; //Global UI SVG Element
let bootstrapModal; //Global Bootstrap Modal Element

let EventListenerList = [];
/*
Saving and Loading Structure will be as follows
type: (Organization/OrgType/Group/User/Line)
name: (Title of Whatever, Blank if a Line)
identifier: (Alphanumeric ID)
labels: (Types/Groups of User/Org can be blank if not one of those)
anchor1: (Alphanumeric of Element, If we are a line)
anchor2:(Alphanumeric of Element, If we are a line)

*/

//Attempt at Creating Custom Modals, Not Finished
const ModalCreator = {
createModal: function(entry, modalId, role) {
	
	const parentDiv = d3.select("#BootstrapModal");
	
	const topDiv = parentDiv.append("div")
	.attr("class", "modal " + entry)
	.attr("id", modalId)
	.attr("role", role)
	const secondDiv = topDiv.append("div")
	.attr("class", "modal-"+role)
	.attr("role", "document")

	//Modal content 
	const ModalContent = secondDiv.append("div")
	.attr("class", "modal-content")
	const ModalHeader = ModalContent.append("div")
	.attr("class", "modal-header")
	
	const ModalBody = ModalContent.append("div")
	.attr("class", "modal-body")
	
	const ModalFooter = ModalContent.append("div")
	.attr("class", "modal-footer")
	
	/*$('#'+modalId).on('hidden.bs.modal', function () {
	  $(this).remove();
	})*/
	
	//$("#"+modalId).modal();
	
	return modalId;
},
	
addCloseButton: function(selectorId)  {
	let modify = undefined;
	if (selectorId.length > 0) {
		modify = d3.select(selectorId[0])
		for (let i = 1; i < selectorId.length; i++) {
			modify = modify.select(selectorId[i])
		}
	}
	let ret = modify.append("button")
	.attr("class", "close")
	.attr("data-dismiss", "modal")
	.text("✕")
	return ret;
},

addHeader: function(selectorId, headerClass, headerSize, input) {
	let modify = undefined;
	if (selectorId.length > 0) {
		modify = d3.select(selectorId[0])
		for (let i = 1; i < selectorId.length; i++) {
			modify = modify.select(selectorId[i])
		}
	}
	let ret = modify.append("h"+String(headerSize))
	.attr("class", headerClass)
	.text(input)
	return ret;
},

addForm: function(selectorId, formId) {
	let modify = undefined;
	if (selectorId.length > 0) {
		modify = d3.select(selectorId[0])
		for (let i = 1; i < selectorId.length; i++) {
			modify = modify.select(selectorId[i])
		}
	}
	let ret = modify.append("form")
	.attr("id", formId)
	return ret;
},

addDiv: function(selectorId, divClass, divId, divInput) {
	let modify = undefined;
	if (selectorId.length > 0) {
		modify = d3.select(selectorId[0])
		for (let i = 1; i < selectorId.length; i++) {
			modify = modify.select(selectorId[i])
		}
	}
	let ret = modify.append("div")
	.attr("class", divClass)
	.attr("id", divId)
	.text(divInput)
	return ret;
},

addLabel: function(selectorId, labelId, labelClass, labelInput) {
	let modify = undefined;
	if (selectorId.length > 0) {
		modify = d3.select(selectorId[0])
		for (let i = 1; i < selectorId.length; i++) {
			modify = modify.select(selectorId[i])
		}
	}
	let ret = modify.append("label")
	.attr("id", labelId)
	.attr("class", labelClass)
	.text(labelInput)
	return ret;
},

addInput: function(selectorId, inputType, inputClass, inputId, inputName, inputPlaceholder, inputInnerText) {
	let modify = undefined;
	if (selectorId.length > 0) {
		modify = d3.select(selectorId[0])
		for (let i = 1; i < selectorId.length; i++) {
			modify = modify.select(selectorId[i])
		}
	}
	let ret = modify.append("input")
	.attr("type", inputType)
	.attr("class", inputClass)
	.attr("id", inputId)
	.attr("name", inputName)
	.attr("placeholder", inputPlaceholder)
	.text(inputInnerText)
	return ret;
},

addSubmit: function(selectorId, buttonClass, buttonText) {
	let modify = undefined;
	if (selectorId.length > 0) {
		modify = d3.select(selectorId[0])
		for (let i = 1; i < selectorId.length; i++) {
			modify = modify.select(selectorId[i])
		}
	}
	let ret = modify.append("button")
	.attr("type", "submit")
	.attr("class", buttonClass)
	.text(buttonText)
	return ret;
},

addLine: function(selectorId, lineStyle, lineSize, lineColor) {
	let modify = undefined;
	if (selectorId.length > 0) {
		modify = d3.select(selectorId[0])
		for (let i = 1; i < selectorId.length; i++) {
			modify = modify.select(selectorId[i])
		}
	}
	let ret = modify.append("hr")
	.attr("style", lineStyle)
	.attr("size", lineSize)
	.attr("color", lineColor)
	return ret;
},

addBreak: function(selectorId) {
	let modify = undefined;
	if (selectorId.length > 0) {
		modify = d3.select(selectorId[0])
		for (let i = 1; i < selectorId.length; i++) {
			modify = modify.select(selectorId[i])
		}
	}
	let ret = modify.append("br")
	return ret;
},

addParagraph: function(selectorId, paragraphStyle, paragraphInput, paragraphId) {
	let modify = undefined;
	if (selectorId.length > 0) {
		modify = d3.select(selectorId[0])
		for (let i = 1; i < selectorId.length; i++) {
			modify = modify.select(selectorId[i])
		}
	}
	let ret = modify.append("p")
	.attr("style", paragraphStyle)
	.attr("id", paragraphId)
	.text(paragraphInput)
	return ret;
},

addLink: function(selectorId, linkUrl, linkText, linkTarget) {
	//<a href='https://fontawesome.com/license/free'>FontAwesome Free License</a>
	let modify = undefined;
	if (selectorId.length > 0) {
		modify = d3.select(selectorId[0])
		for (let i = 1; i < selectorId.length; i++) {
			modify = modify.select(selectorId[i])
		}
	}
	let ret = modify.append("a")
	.attr("href", linkUrl)
	.attr("target", linkTarget)
	.text(linkText)
	return ret;
}

}

function initModals() {
	
	/*
	Deals with creating all the Bootstrap Modals using d3.js to append divs and form elements
	*/
	bootstrapModal = ModalCreator.addDiv([".hierarchy_designer"], "BootstrapModal", "BootstrapModal", "")
	console.log(bootstrapModal)
	console.log("Hello")
	const ListTags = ModalCreator.createModal("fade", "modalNodeListTags", "dialog");
	ModalCreator.addCloseButton(["#"+ListTags, ".modal-header"])
	ModalCreator.addHeader(["#"+ListTags, ".modal-header"], "modal-title", 4, "List of all Tags for this Node")
	ModalCreator.addForm(["#"+ListTags, ".modal-body"], "nodeListTagsForm")
	ModalCreator.addDiv(["#nodeListTagsForm"], "form-check", "addMoreTags")
	console.log(ListTags);
	
	const CreateOrg = ModalCreator.createModal("fade", "modalNodeCreateOrg", "dialog");
	ModalCreator.addCloseButton(["#"+CreateOrg, ".modal-header"])
	ModalCreator.addHeader(["#"+CreateOrg, ".modal-header"], "modal-title", 4, "Create a new organization node");
	ModalCreator.addForm(["#"+CreateOrg, ".modal-body"], "nodeCreateForm")
	ModalCreator.addDiv(["#nodeCreateForm"], "form-group", "form-group")
	ModalCreator.addDiv(["#nodeCreateForm"], "form-check", "form-check")
	ModalCreator.addLabel(["#nodeCreateForm", ".form-group"], "OrgName", "", "Organization Name")
	ModalCreator.addInput(["#nodeCreateForm", ".form-group"], "text", "form-control", "nodeCreateName", "Org", "GitHub")
	ModalCreator.addInput(["#nodeCreateForm", ".form-group"], "checkbox", "form-check-input", "exampleCheck1", "UserCheck")
	ModalCreator.addLabel(["#nodeCreateForm", ".form-group"], "", "form-check-label", "Check this box to create a User")
	ModalCreator.addSubmit(["#nodeCreateForm"], "btn btn-primary", "Submit")
	console.log(CreateOrg)
	
	
	const CreateTags = ModalCreator.createModal("fade", "modalNodeCreateTags", "dialog")
	ModalCreator.addCloseButton(["#"+CreateTags, ".modal-header"]);
	ModalCreator.addHeader(["#"+CreateTags, ".modal-header"], "modal-title", 4, "Create a new User Group or Organization Type")
	ModalCreator.addForm(["#"+CreateTags, ".modal-body"], "nodeCreateTagsForm")
	ModalCreator.addDiv(["#nodeCreateTagsForm"], "form-group", "form-group", "User Group/Org Type Name")
	ModalCreator.addDiv(["#nodeCreateTagsForm"], "form-check", "form-check")
	ModalCreator.addInput(["#nodeCreateTagsForm", ".form-group"], "text", "form-control", "nodeCreateName", "TagName", "Dealership/Dealer")
	ModalCreator.addInput(["#nodeCreateTagsForm", ".form-check"], "checkbox", "form-check-input", "exampleCheck1", "UserCheck")
	ModalCreator.addLabel(["#nodeCreateTagsForm", ".form-check"], "", "form-check-label", "Check this box to create a User Group")
	ModalCreator.addLine(["#nodeCreateTagsForm"], "width:100%", "2", "black")
	ModalCreator.addHeader(["#nodeCreateTagsForm"], "modal-title", 4, "Can only link to these tags")
	ModalCreator.addHeader(["#nodeCreateTagsForm"], "modal-title", 6, "(Leave Blank for Unrestricted Linking)")
	ModalCreator.addHeader(["#nodeCreateTagsForm"], "modal-title", 6, "(Organization would be child of these tags)")
	ModalCreator.addDiv(["#nodeCreateTagsForm"], "form-check", "RestrictiveTags")
	ModalCreator.addSubmit(["#nodeCreateTagsForm"], "btn btn-primary", "Submit")
	
	const ConnectUser = ModalCreator.createModal("fade", "modalNodeAddUserGroup", "dialog")
	ModalCreator.addCloseButton(["#"+ConnectUser, ".modal-header"]);
	ModalCreator.addHeader(["#"+ConnectUser, ".modal-header"], "modal-title", 4, "Connect User to Org Using These Tags")
	ModalCreator.addForm(["#"+ConnectUser, ".modal-body"], "nodeAddUserGroup")
	ModalCreator.addDiv(["#nodeAddUserGroup"], "form-check", "addUserGroup")
	ModalCreator.addSubmit(["#nodeAddUserGroup"], "btn btn-primary", "Submit")
	
	
	const EditOrg = ModalCreator.createModal("fade", "modalNodeEditOrg", "dialog")
	ModalCreator.addCloseButton(["#"+EditOrg, ".modal-header"]);
	ModalCreator.addHeader(["#"+EditOrg, ".modal-header"], "modal-title", 4, "Edit Organization Node");
	ModalCreator.addForm(["#"+EditOrg, ".modal-body"], "nodeEditOrgForm")
	ModalCreator.addDiv(["#nodeEditOrgForm"], "form-group")
	ModalCreator.addLabel(["#nodeEditOrgForm", ".form-group"], "", "", "Organization Name")
	ModalCreator.addInput(["#nodeEditOrgForm", ".form-group"], "text", "form-control", "nodeEditName", "Org", "GitHub");
	ModalCreator.addDiv(["#nodeEditOrgForm"], "form-check")
	ModalCreator.addSubmit(["#nodeEditOrgForm"], "btn btn-primary", "Submit")
	
	const NewSvg = ModalCreator.createModal("fade", "modalNewSVG", "dialog")
	ModalCreator.addCloseButton(["#"+NewSvg, ".modal-header"]);
	ModalCreator.addHeader(["#"+NewSvg, ".modal-header"], "modal-title", 4, "Start a new blank SVG")
	ModalCreator.addForm(["#"+NewSvg, ".modal-body"], "nodeNewSVG");
	ModalCreator.addDiv(["#nodeNewSVG"], "form-group")
	ModalCreator.addInput(["#nodeNewSVG", ".form-group"], "text", "", "", "height", "Height", " Height")
	ModalCreator.addBreak(["#nodeNewSVG", ".form-group"])
	ModalCreator.addInput(["#nodeNewSVG", ".form-group"], "text", "", "", "width", "Width", " Width")
	ModalCreator.addSubmit(["#nodeNewSVG"], "btn btn-primary", "Submit")
	
	const aboutTool = ModalCreator.createModal("fade", "modalAboutTool", "dialog")
	ModalCreator.addCloseButton(["#"+aboutTool, ".modal-header"])
	ModalCreator.addHeader(["#"+aboutTool, ".modal-header"], "modal-title", 4, "About Hierarchy Designer")
	ModalCreator.addParagraph(["#"+aboutTool, ".modal-body"], "text-align:center;", "Developed by Shubshub", "p1")
	ModalCreator.addParagraph(["#"+aboutTool, ".modal-body"], "text-align:center;", "Vector Icon License: ", "p2")
	ModalCreator.addLink(["#"+aboutTool, ".modal-body", "#p2"], "https://fontawesome.com/license/free", "FontAwesome Free License", "_blank") 
	ModalCreator.addParagraph(["#"+aboutTool, ".modal-body"], "text-align:center;", "Tested on Chrome 91.0.4472.114, Firefox 89.0.2, Edge 91.0.864.59", "p3")
	ModalCreator.addParagraph(["#"+aboutTool, ".modal-body"], "text-align:center;", "hopefully it works lol", "p4")
	ModalCreator.addParagraph(["#"+aboutTool, ".modal-body"], "text-align:center;", `Version ${GlobalVersion}`, "p5")
	
}
function svgToImage() {
	var doctype = '<?xml version="1.0" standalone="no"?>'
             + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

	var source = (new XMLSerializer()).serializeToString(d3.select(svg).node());

	var blob = new Blob([ doctype + source], { type: 'image/svg+xml' });
	
	var url = window.URL.createObjectURL(blob);
	var img = new Image();
	img.src =  url;
	
	img.onload = function(){
	var canvas = d3.select('body').append('canvas').node();
	canvas.width = 680;
	canvas.height = 530;

	var ctx = canvas.getContext('2d');

	// draw image on canvas
	ctx.drawImage(img, 0, 0);
	var canvasUrl = canvas.toDataURL("image/png");
	canvas.remove();
	// ajax call to send canvas(base64) url to server. Or create anchor tag to give download option 
}
}

//Default Loading Function, Grabs from Local Storage
function exampleLoad() {
	
	/*
	Elements to Load
	data[0] = {Node List, "nodes"}
	data[1] = {GroupList, "userLabel"}
	data[2] = {LabelList, "orgLabels"}
	data[3] = {User Line Parents, "userParents"}
	data[4] = {Org Line Parents, "orgParents"}
	
	
	
	Loop through Node List
	{
	CreationData[0] = Organization Name
	CreationData[1] = Is User?
		
		
	createNode(x, y, width, height, CreationData, Identifier, false);
	
	All Lines that are attached to this node
	Concatenate this to a seperate variable that is outside of the loop
	User Data: {Tag Name, Is User?} Loop this and store all Tag Data attached to Node in its own array
	makeLabel(User Data, is User?, d3.select("#"+_id));
	}
	
	Create a seperate array with duplicate entries of User Line Parents removed
	Loop through unique data[3] (User Parents)
	{
		const lineID = linkPaths(userData[z].par1, userData[z].par2);
		addLinkButton(User Data Current.par1, User Data Current.par2, lineID[0], false);
		const label = addLabelLine(lineID[0], User Data Current.tex, lineID[1],User Data Current.par1, User Data Current.par2);
	}
	Do the same with Organization Line Parents
	
	*/
	d3.selectAll("svg#designerID > .draggable").remove()
	d3.selectAll("svg#designerID > #lineGroup > *").remove()
	d3.selectAll("svg#designerID > #userSpaceGroup > *").remove()
	const data = JSON.parse(localStorage.getItem("GameData"));
	console.log(data)
	AllLineData = [];
	GroupList = data[1].data;
	LabelList = data[2].data;
	if (data[0].type == "nodes") {
		const workingData = data[0].data;
		for (var j = 0; j < workingData.length; j++) {
			//createNode(x, y, width, height, CreationData, id)
			//createNode(45, 55, 250, 100, CreationData);
			const CreationData = [];
			const TagData = workingData[j].TagData;
			CreationData[0] = workingData[j].OrgName;
			CreationData[1] = workingData[j].isUser;
			const _x = workingData[j].x;
			const _y = workingData[j].y;
			const _id = workingData[j].id;
			createNode(_x, _y, 250, 100, CreationData, _id, false);
			AllLineData = AllLineData.concat(workingData[j].LineData);
			console.log(TagData);

			const UserData = [];
			for (var k = 0; k < TagData.length; k++) {
				workingTag = TagData[k];
				UserData.push({name: workingTag, value: CreationData[1]});
				
			}
			makeLabel(UserData, CreationData[1], d3.select("#"+_id));
			
		}
		
		
	}
	
	if (data[3].type == "userParents") {
		let userData = data[3].data;
		console.log("User Data Parents");
		userData = Array.from(new Set(userData.map(JSON.stringify)), JSON.parse)
		console.log(userData);
		for (var z = 0; z < userData.length; z++) {
			const lineID = linkPaths(userData[z].par1, userData[z].par2);
			addLinkButton(userData[z].par1, userData[z].par2, lineID[0], false, lineID[1]);
			if (lineID[0] != false) {
				const label = addLabelLine(lineID[0], userData[z].tex, lineID[1], userData[z].par1, userData[z].par2);
			} else {
				console.log("Failed Link for Some Reason");
			}
		}
	}
	
	if (data[4].type == "orgParents") {
		let userData = data[4].data;
		userData = Array.from(new Set(userData.map(JSON.stringify)), JSON.parse)
		 console.log("Org Data Parents");
		 console.log(userData);
		for (var z = 0; z < userData.length; z++) {
			const lineID = linkPaths(userData[z].par1, userData[z].par2);
			addLinkButton(userData[z].par1, userData[z].par2, lineID[0], false, lineID[1]);
			if (lineID[0] != false) {
				const label = addLabelLine(lineID[0], userData[z].tex, lineID[1], userData[z].par1, userData[z].par2);
			} else {
				console.log("Failed Link for Some Reason");
			}
		}
	}
	console.log("All Line Data")
	console.log(AllLineData);
	console.log("User Groups");
	console.log(GroupList);
	console.log("Org Types");
	console.log(LabelList);
}

//Default Saving Function, Just Saves to Local Storage
function exampleSave() {

	/*
	Elements to Save
	GroupList - User Groups
	LabelList - Organization Types
	All Nodes - Visual Display
	All Lines - Connected Pathways
	All Created User Group Labels - Theyre attached to the Lines
	All Created Organization Type Labels - Theyre attached to the Nodes
	
	User Linked Pathways
	{
	par1: Parent1 ID
	par2: Parent2 ID
	tex: Label Text
	}
	
	Organization Linked Pathways
	{
	par1: Parent1 ID
	par2: Parent2 ID
	tex: Label Text
	}
	
	CompleteNode(name, _x, _y, LineData, TagData, OrgIdentifier, myself.attr("isUser"))
	Nodes
	{
		name: Organization/User Name
		x: X Position
		y: Y Position
		LineData: [Line Anchor1, Line Anchor2] Lines that attached to this node
		TagData: [Label Number] //All of them in an array
		id: Alpha Numeric Identifier of this Node
		isUser: Is this a user or an organization "on" for User
	}
	
	data[0] = {Node List, "nodes"}
	data[1] = {GroupList, "userLabel"}
	data[2] = {LabelList, "orgLabels"}
	data[3] = {User Line Parents, "userParents"}
	data[4] = {Org Line Parents, "orgParents"}
	
	EntireStructure.push(StructureData(NodeList, "nodes"))
	EntireStructure.push(StructureData(UserLabels, "userLabel"));
	EntireStructure.push(StructureData(OrgLabels, "orgLabels"));
	EntireStructure.push(StructureData(UserParents, "userParents"));
	EntireStructure.push(StructureData(OrgParents, "orgParents"));
	*/
	
	const CompleteNode = function(OrgName, X, Y, LineData, TagData, ID, isUser) {
		let FullNode = {};
		FullNode.OrgName = OrgName
		FullNode.id = ID
		FullNode.x = X
		FullNode.y = Y
		FullNode.LineData = LineData
		FullNode.TagData = TagData
		FullNode.isUser = isUser
		return FullNode;
	}
	
	UserLabels = GroupList;
	OrgLabels = LabelList;
	UserParents = [];
	OrgParents = [];
	
	NodeList = [];
	
	console.log("All Nodes");
	const AllNodes = d3.selectAll("g.draggable");
	const AllLines = d3.selectAll("line.linkedLine");
	const AllUserSpace = d3.selectAll(".userLineSpaceText")
	const AllOrgSpace = d3.selectAll(".orgLineSpaceText");
	AllUserSpace
		.each(function(d, i) {
			const myself = d3.select(this);
			const parent1 = myself.attr("parent1");
			const parent2 = myself.attr("parent2");
			const txt = myself.text();
			UserParents.push({par1: parent1, par2: parent2, tex: txt});
		});
		
	AllOrgSpace
		.each(function(d, i) {
			const myself = d3.select(this);
			const parent1 = myself.attr("parent1");
			const parent2 = myself.attr("parent2");
			const txt = myself.text();
			OrgParents.push({par1: parent1, par2: parent2, tex: txt});
		});
	AllNodes
		.each(function(d, i)  {
			const myself = d3.select(this);
			const OrgIdentifier = myself.attr("id");
			const nameRect = myself.select(".displayText");
			const name = nameRect.text();
			const _x = myself.attr("offX");
			const _y = myself.attr("offY");
			const LineData = [];
			const TagData = [];
			
			const AllTags = myself.selectAll(".LabelSpace");
			//console.log(AllTags);
			
			AllTags
				.each(function(d, i) {
					thisTag = d3.select(this);
					TagData.push(thisTag.attr("typeNum"));
				});
				
			//console.log("Tag Data");
			//console.log(TagData);
			
			AllLines
				.each(function(d, i) {
					const meHere = d3.select(this);
					let anchor1 = meHere.attr("anchor1");
					let anchor2 = meHere.attr("anchor2");
					
					anchor1 = anchor1.replace("#", "");
					anchor2 = anchor2.replace("#", "");
					
					if (anchor1 == OrgIdentifier || anchor2 == OrgIdentifier) {
						LineData.push([anchor1, anchor2]);
					}
					
				});
			
			NodeList.push(CompleteNode(name, _x, _y, LineData, TagData, OrgIdentifier, myself.attr("isUser")));
			
		});
	//console.log(NodeList);
	
	EntireStructure = []
	const StructureData = function(data, type) {
		let dt = {}
		dt.type = type;
		dt.data = data;
		return dt;
	}
	
	EntireStructure.push(StructureData(NodeList, "nodes"))
	EntireStructure.push(StructureData(UserLabels, "userLabel"));
	EntireStructure.push(StructureData(OrgLabels, "orgLabels"));
	EntireStructure.push(StructureData(UserParents, "userParents"));
	EntireStructure.push(StructureData(OrgParents, "orgParents"));
	
	console.log("Entire Structure");
	console.log(EntireStructure);
	
	localStorage.setItem('GameData', JSON.stringify(EntireStructure));
}

//Start Dragging
function dragStart() {
		/*
		Grab the Mouse X and Y and subtract the Elements X and Y for Smooth Dragging
		*/
		const current = d3.select(this);
		const baseElement = current;
		offset.x = d3.event.x - baseElement.attr('offX');
		offset.y = d3.event.y - baseElement.attr('offY');
}

//Currently Dragging
function dragged() {
	/*
	Updates the Position of All Nodes, All Lines, All Label Text on Lines
	*/
	if (linking == false) {
		const current = d3.select(this);

		const currentX = current.attr("offX");
		const currentY = current.attr("offY");
		const realPositionX = d3.event.x - offset.x;
		const realPositionY = d3.event.y - offset.y;
		
		const allElements = current;
		
		//We act upon all the elements and use a built in offset value thats created when the element is create which anchors it within the baseElement
		allElements
			.each(function(d, i) {
				const myself = d3.select(this);
				
				myself
					.attr("transform", `translate(${realPositionX}, ${realPositionY})`)
					.attr("offX", realPositionX)
					.attr("offY", realPositionY)
					
				if (myself.attr("offX") != currentX || myself.attr("offY") != currentY) {
					myself.attr("dirty", true)
				}
			});
		
		
		const allLines = d3.selectAll("line.linkedLine");
		allLines
			.each(function(d, i) {
				const myself = d3.select(this);
				
				const currentX1 = myself.attr("x1");
				const currentY1 = myself.attr("y1");
				const currentX2 = myself.attr("x2");
				const currentY2 = myself.attr("y2");
				
				const firstBaseElementID = myself.attr("anchor1");
				const secondBaseElementID = myself.attr("anchor2");
				const firstGroup = d3.select(firstBaseElementID);
				const secondGroup = d3.select(secondBaseElementID);
				const firstBaseElem = d3.select(firstBaseElementID).select(".baseElement");
				const secondBaseElem = d3.select(secondBaseElementID).select(".baseElement");
					
				const firstWidth = parseInt(firstBaseElem.attr("width"));
				const firstHeight = parseInt(firstBaseElem.attr("height"));
				const secondWidth = parseInt(secondBaseElem.attr("width"));
				const secondHeight = parseInt(secondBaseElem.attr("height"));
				
				const firstX = parseInt(firstGroup.attr("offX"));
				const firstY = parseInt(firstGroup.attr("offY"));
				const secondX = parseInt(secondGroup.attr("offX"));
				const secondY = parseInt(secondGroup.attr("offY"));
				
				myself
					.attr("x1", firstX + (firstWidth/2))
					.attr("y1", firstY + (firstHeight/2))
					.attr("x2", secondX + (secondWidth/2))
					.attr("y2", secondY + (secondHeight/2));
					
				if (myself.attr("x1") != currentX1 || myself.attr("x2") != currentX2 || myself.attr("y1") == currentY1 || myself.attr("y2") != currentY2) {
					myself.attr("dirty", true);
				}
			});
			
			

		const allUserSpaceText = d3.selectAll("text.userLineSpaceText, text.userLineSpaceTextBG");
		allUserSpaceText
			.each(function(d, i) {
				const myself = d3.select(this);
				const myLine = d3.select("#"+myself.attr("anchor"));
				
				const xLine1 = parseInt(myLine.attr("x1"));
				const xLine2 = parseInt(myLine.attr("x2"));
				const yLine1 = parseInt(myLine.attr("y1"));
				const yLine2 = parseInt(myLine.attr("y2"));
				const midpointx = (xLine1 + xLine2) / 2;
				const midpointy = (yLine1 + yLine2) / 2;
				
				myself.attr("x", midpointx);
				myself.attr("y", midpointy + parseInt(myself.attr("height")));
				myself.attr("offX", midpointx);
				myself.attr("offY", midpointy + parseInt(myself.attr("height")));
			});
			
		const allOrgSpaceText = d3.selectAll("text.orgLineSpaceText, text.orgLineSpaceTextBG");
		allOrgSpaceText
			.each(function(d, i) {
				const myself = d3.select(this);
				const myLine = d3.select("#"+myself.attr("anchor"));
				const parentElement = myself.attr("parentElement");
				const xLine1 = parseInt(myLine.attr("x1"));
				const xLine2 = parseInt(myLine.attr("x2"));
				const yLine1 = parseInt(myLine.attr("y1"));
				const yLine2 = parseInt(myLine.attr("y2"));
				const midpointx = (xLine1 + xLine2) / 2;
				const midpointy = (yLine1 + yLine2) / 2;
				
				let modmidpointx = 0;
				let modmidpointy = 0;
				if (parentElement == "first") {
					modmidpointx = (xLine1 + midpointx) / 2;
					modmidpointy = (yLine1 + midpointy) / 2;
				} else {
					modmidpointx = (xLine2 + midpointx) / 2;
					modmidpointy = (yLine2 + midpointy) / 2;
				}
				
				myself.attr("x", modmidpointx);
				myself.attr("y", modmidpointy + parseInt(myself.attr("height")));
				myself.attr("offX", modmidpointx);
				myself.attr("offY", modmidpointy + parseInt(myself.attr("height")));
			});
	}
		
		
}

//Edit the Organization/User Name
function editText(e) {
	

	const parentElement = d3.select(this.parentNode)
	const myself = parentElement.select(".displayText");
	$("#modalNodeEditOrg").modal();
	$("#nodeEditOrgForm").submit(function(event) {
			const data = $("#nodeEditOrgForm").serializeArray();
			
			const OrgName = data[0].value;
			//console.log(data);
			if (OrgName != "") {
				myself.text(OrgName);
				const textSpace = parentElement.select(".spaceText")
				const TextLength = myself.node().getComputedTextLength();
				textSpace.attr("width", TextLength + 4);
				parentElement.attr("dirty", true)
			}
			
			$("#modalNodeEditOrg").modal("hide");
			event.preventDefault();
			$("#nodeEditOrgForm").unbind();
	});
}

function AlphaNumericRandom() 
{
	/*
	Generates an AlphaNumeric String and stores it in a Global List so only unique values can be created
	*/
	const anr = "a" + Math.random().toString(36).slice(2);
	if (GlobalIDList.indexOf(anr) == -1) {
		GlobalIDList.push(anr);
	} else {
		console.log("Regenerating");
		anr = AlphaNumericRandom();
	}
	return anr;
}


function MouseMoveCapture() {
	/*
	If we are linking an object to another then have a line that follows the position of the mouse
	Removed upon us no longer being in a link state wether the link succeeded or not
	*/
		//Execute code while the mouse is moving
		if (linking == true) {
				MouseLines = d3.select("line.followMouse")
				
				//var offsetX = d3.event.x - MouseLines.attr("x2");
				//var offsetY = d3.event.y - MouseLines.attr("y2");
				MouseLines
					.attr("x2", d3.event.x + document.documentElement.scrollLeft)
					.attr("y2", d3.event.y + document.documentElement.scrollTop)
					
					
					
					/*
					offset.x = d3.event.x - baseElement.attr('offX');
					offset.y = d3.event.y - baseElement.attr('offY');
}
					*/
					
		} else if (linking == false) {
				MouseLines = d3.select("line.followMouse")
				MouseLines.remove();
		}
		
}

function populateUserTags() {
	/*
	Populates a Modal with Checkboxes allowing the user to add tags to a node
	*/
	const tagsModal = d3.select("#addUserGroup");
	
	const createCheckbox = function(obj) {
		const inputBox = tagsModal.append("input")
        .attr("type", "checkbox")
		.attr("class", "form-check-input")
		.attr("name", obj)
		.attr("id", AlphaNumericRandom())
		
		//console.log(ListOfAlready);
		//console.log(obj);
	}
	
	const createLabel = obj => tagsModal.append("label")
		.attr("class", "form-check-label")
		.attr("name", AlphaNumericRandom())
		.style("padding-right", "10px")
		.style("padding-left", "2px")
		.text(obj)
	
	for (let i = 0; i < GroupList.length; i++) {
		createCheckbox(i);
		createLabel(GroupList[i][0].value + " ");
	}
		
	if (GroupList.length == 0) {
		createLabel("There are no groups to display");
	}
}

function addLabelLine(lineID, userText, parentElement, firstElementID, secondElementID) {
	if (parentElement == undefined) {
		return;
	}
	/*
	Creates a User Label on a connected line between two nodes
	*/
	const thisLine = d3.select(`line#${lineID}`);
	thisLine.append("rect") 
	const userSpace = {
		x: 0,
		y: 0,
		h: 24,
		w: 128,
		color: "white",
		class: "userLineSpace",
		toolTip: "User Role",
		zindex: -1
	}
	
	const orgSpace = {
		x: 0,
		y: 0,
		h: 24,
		w: 128,
		color: "white",
		class: "orgLineSpace",
		toolTip: "User Role",
		zindex: -1
	}
	
	const spaceGroup = d3.select("#userSpaceGroup")
	const createElement = function(obj) {
		const identifier = AlphaNumericRandom();
		const xLine1 = parseInt(thisLine.attr("x1"));
		const xLine2 = parseInt(thisLine.attr("x2"));
		const yLine1 = parseInt(thisLine.attr("y1"));
		const yLine2 = parseInt(thisLine.attr("y2"));
		const midpointx = (xLine1 + xLine2) / 2;
		const midpointy = (yLine1 + yLine2) / 2;
		
		let mx = midpointx;
		let my = midpointy;
		
		if (parentElement != "none") {
			let modmidpointx = 0;
			let modmidpointy = 0;
			if (parentElement == "first") {
				d3.select("#"+secondElementID).attr("CanLink", false)
				modmidpointx = (xLine1 + midpointx) / 2;
				modmidpointy = (yLine1 + midpointy) / 2;
			} else {
				d3.select("#"+firstElementID).attr("CanLink", false)
				modmidpointx = (xLine2 + midpointx) / 2;
				modmidpointy = (yLine2 + midpointy) / 2;
			}
			
			mx = modmidpointx;
			my = modmidpointy;
		}
		
		spaceGroup.append("text")
		.text(userText)
		.attr("x", mx)
		.attr("y", my + (obj.h))
		.attr("offX", mx)
		.attr("offY", my + (obj.h))
		.attr("height", obj.h)
		.attr("fill", "black")
		.attr("class", obj.class + "TextBG")
		.attr("id", identifier)
		.attr("anchor", lineID)
		.attr("parent1", firstElementID)
		.attr("parent2", secondElementID)
		.attr("parentElement", parentElement)
		.attr("text-anchor", "middle")
		.attr("filter", "url(#solid)")
		.append("title")
		.text(obj.toolTip)
		
		spaceGroup.append("text")
		.text(userText)
		.attr("x", mx)
		.attr("y", my + (obj.h))
		.attr("offX", mx)
		.attr("offY", my + (obj.h))
		.attr("height", obj.h)
		.attr("fill", "black")
		.attr("parent1", firstElementID)
		.attr("parent2", secondElementID)
		.attr("parentElement", parentElement)
		.attr("class", obj.class + "Text")
		.attr("id", identifier)
		.attr("anchor", lineID)
		.attr("text-anchor", "middle")
		return d3.select("#"+identifier);
	}
	
	if (parentElement == "none") {
		createElement(userSpace);
	} else {
		createElement(orgSpace);
	}
	
	
}

function clickHandler() {
	/*
	Handles the Click Event for each Node
	Deals with Linking and User Group Label Adding
	*/
	
	const thisElement = d3.select(this)
	const parentElement = d3.select(this.parentNode)
	//console.log(thisElement)
	const testValue = thisElement.attr("linking");
	
	//console.log((testValue == "true"))
	if (testValue == "true" && linking == true) {
			//Do Nothing
			//console.log("Linking Cancelled");
			linking = false;
			thisElement.attr("linking", false)
			const line = d3.select("line.followMouse");
			line.remove()
	} else if (testValue == "false" && linking == true) {
		
			const alreadyLinked = parentElement.attr("linked")
			const ParentisUser = parentElement.attr("isUser");
			const SourceisUser = d3.select("#"+linkingBaseID).attr("isUser");
			
			console.log("Source User: " + SourceisUser);
			console.log("Parent User: " + ParentisUser);
		
			linking = false;
			
			
			GlobalParentUser = ParentisUser;
			GlobalSourceUser = SourceisUser;
			if (GlobalSourceUser == "on" || GlobalParentUser == "on") {
				populateUserTags();
				$("#modalNodeAddUserGroup").modal()
				$("#modalNodeAddUserGroup").submit(function (event) {
					
					const data = $("#nodeAddUserGroup").serializeArray();
					const user = d3.select("#addUserGroup").attr("isUser")
					console.log("The Data");
					console.log(data);
					if (data.length != 0) {
						if (GlobalParentUser == "on") {
							makeLabel(data, "on", parentElement);
						} else if (GlobalSourceUser == "on") {
							makeLabel(data, "on", d3.select("#"+linkingBaseID))
						}
					
						
					}
					d3.select("#addUserGroup").selectAll("*").remove();
					
					const lineID = linkPaths(linkingBaseID, parentElement.attr("id"))
					if (lineID[0] != false) {
						
						const sourceElement = d3.select("#"+linkingBaseID)
						const sourceBase = sourceElement.select(".baseElement");
						sourceBase.attr("linking", "false");
						//console.log("Linked Successfully!")
						const line = d3.select("line.followMouse");
						line.remove()
						addLinkButton(linkingBaseID, parentElement.attr("id"), lineID[0], true, lineID[1]);
						
						addLabelLine(lineID[0], GroupList[parseInt(data[0].name)][0].value, lineID[1], linkingBaseID, parentElement.attr("id"));
					} else {
						console.log("Path linking failed!");
					}
					$("#modalNodeAddUserGroup").modal("hide");
					
					event.preventDefault();
				});
				$("#modalNodeAddUserGroup").on('hidden.bs.modal', function() {
					$("#modalNodeAddUserGroup").unbind();	
				});
			} else {
				const lineID = linkPaths(linkingBaseID, parentElement.attr("id"))
				if (lineID[0] != false) {
					const sourceElement = d3.select("#"+linkingBaseID)
					const sourceBase = sourceElement.select(".baseElement");
					sourceBase.attr("linking", "false");
					//console.log("Linked Successfully!")
					const line = d3.select("line.followMouse");
					line.remove()
					addLinkButton(linkingBaseID, parentElement.attr("id"), lineID[0], true, lineID[1]);
					
					addLabelLine(lineID[0], "Parent", lineID[1], linkingBaseID, parentElement.attr("id"));
				} else {
					console.log("Path linking failed!");
				}
			}
			
			
			
	}
}

function deleteLink(input) {
	
		/*
		Deletes the Link between User/Organization
		*/
		if (input == undefined) {
			input = this;
		}
		const myself = d3.select(input);
		const parentMyself = d3.select(input.parentNode);
		parentMyself.attr("dirty", true)
		if (parentMyself.empty()) {
			console.log("No Existing Parent, Returning");
			return;
		}
		const lineID = myself.attr("lineID");

		let lineToDelete = undefined
		try {
			lineToDelete = d3.select(`line#${lineID}`);
		} catch {
			console.log("No Line to Delete");
		}
		const currentLinkNumber = myself.attr("linkNumber");
		
		const otherID = myself.attr("otherID");
		const otherElement = d3.select("#"+otherID);
		//console.log(otherElement);
		
		
	
		let linksParent = parseInt(parentMyself.attr("numLinks"));
		linksParent--;
		myself.remove();
		
		try {
			lineToDelete.remove();
		} catch {
			console.log("No Line to Delete");
		}
		
		parentMyself.attr("numLinks", linksParent);
		
		const ElementColor = "#757272"
		
		const linkButton = {
			x: 2,
			y: 10,
			w: 8,
			h: 8,
			color: ElementColor,
			toolTip: "Linked Path",
			class: "linkedPath",
			on: deleteLink
		}

		//Update the other Link Boxes
		const updateLinkers = function(obj, links, currentNum){
			const linkedPaths = obj.selectAll(".linkedPath");
			//console.log("Current Number: " + currentNum);
			//console.log("Total Links: " + links);
			//console.log(linkedPaths)
			linkedPaths
				.each(function(d, i) {
					
					const myself = d3.select(this)
					let myLinkNumber = parseInt(myself.attr("linkNumber"));
					//console.log("My Number: " + myLinkNumber)
					
					if (myLinkNumber > currentNum) {
						myLinkNumber--;
						//console.log("Updated");
						
						//console.log("New Number: " + myLinkNumber);
						myself.attr("linkNumber", myLinkNumber);
						myself.attr("x", linkButton.x + (10 * myLinkNumber))
						myself.attr("offX", linkButton.x + (10 * myLinkNumber))
						
					}
					
					
				});
		}
		
		updateLinkers(parentMyself, linksParent, parseInt(currentLinkNumber));
		
		const spaceText = d3.selectAll("text.userLineSpaceText, text.userLineSpaceTextBG");
		spaceText
			.each(function(d, i) {
				const myself = d3.select(this);
				const anchor = myself.attr("anchor");
				
				if (anchor == lineID) {
					myself.remove();
				}
				
				
			});
			
		const orgSpaceText = d3.selectAll("text.orgLineSpaceText, text.orgLineSpaceTextBG");
		orgSpaceText
			.each(function(d, i) {
				const myself = d3.select(this);
				const anchor = myself.attr("anchor");
				
				if (anchor == lineID) {
					myself.remove();
				}
				
				
			});
		
		if (!lineToDelete.empty()) {
			//Idk why but this solved a lot of issues
			otherElement.dispatch("click");
		}
	return myself;
}

function deleteLinkAlt() {
	/*
	Alternate version of deleteLink that also restores the ability to link an organization to a parent
	*/
	
		console.log("Deleted this");
		const myself = d3.select(this);
		const parentMyself = d3.select(this.parentNode);
		parentMyself.attr("dirty", true)
		parentMyself.attr("CanLink", true)
		if (parentMyself.empty()) {
			console.log("No Existing Parent, Returning");
			return;
		}
		const lineID = myself.attr("lineID");

		let lineToDelete = undefined
		try {
			lineToDelete = d3.select(`line#${lineID}`);
		} catch {
			console.log("No Line to Delete");
		}
		const currentLinkNumber = myself.attr("linkNumber");
		
		const otherID = myself.attr("otherID");
		const otherElement = d3.select("#"+otherID);
		//console.log(otherElement);
		
		
	
		let linksParent = parseInt(parentMyself.attr("numLinks"));
		linksParent--;
		myself.remove();
		
		try {
			lineToDelete.remove();
		} catch {
			console.log("No Line to Delete");
		}
		
		parentMyself.attr("numLinks", linksParent);
		
		const ElementColor = "#757272"
		
		const linkButton = {
			x: 2,
			y: 10,
			w: 8,
			h: 8,
			color: ElementColor,
			toolTip: "Linked Path",
			class: "linkedPath",
			on: deleteLink
		}

		//Update the other Link Boxes
		const updateLinkers = function(obj, links, currentNum){
			const linkedPaths = obj.selectAll(".linkedPath");
			//console.log("Current Number: " + currentNum);
			//console.log("Total Links: " + links);
			//console.log(linkedPaths)
			linkedPaths
				.each(function(d, i) {
					
					const myself = d3.select(this)
					let myLinkNumber = parseInt(myself.attr("linkNumber"));
					//console.log("My Number: " + myLinkNumber)
					
					if (myLinkNumber > currentNum) {
						myLinkNumber--;
						//console.log("Updated");
						
						//console.log("New Number: " + myLinkNumber);
						myself.attr("linkNumber", myLinkNumber);
						myself.attr("x", linkButton.x + (10 * myLinkNumber))
						myself.attr("offX", linkButton.x + (10 * myLinkNumber))
						
					}
					
					
				});
		}
		
		updateLinkers(parentMyself, linksParent, parseInt(currentLinkNumber));
		
		const spaceText = d3.selectAll("text.userLineSpaceText, text.userLineSpaceTextBG");
		spaceText
			.each(function(d, i) {
				const myself = d3.select(this);
				const anchor = myself.attr("anchor");
				
				if (anchor == lineID) {
					myself.remove();
				}
				
				
			});
			
		const orgSpaceText = d3.selectAll("text.orgLineSpaceText, text.orgLineSpaceTextBG");
		orgSpaceText
			.each(function(d, i) {
				const myself = d3.select(this);
				const anchor = myself.attr("anchor");
				
				if (anchor == lineID) {
					myself.remove();
				}
				
				
			});
		
		if (!lineToDelete.empty()) {
			//Idk why but this solved a lot of issues
			otherElement.dispatch("click");
		}
		
}

function addLinkButton(sourceElementID, destinElementID, lineID, dirty, parentElement) {
	/*
	Adds a button to the node that when clicked will delete the link associated with the button,
	Buttons are also laid out based on how many existing buttons there are
	*/
	if (parentElement == undefined) {
		parentElement = "none";
	}
	if (dirty == undefined) {
		dirty = true;
	}
	const sourceElement = d3.select("#"+sourceElementID);
	const destinElement = d3.select("#"+destinElementID);
	const sourceBase = sourceElement.select(".baseElement");
	const destinBase = d3.select(".baseElement");
	
	const sourceID = AlphaNumericRandom();
	const destinID = AlphaNumericRandom();
	
	let numLinksSource = parseInt(sourceElement.attr("numLinks"));
	let numLinksDestin = parseInt(destinElement.attr("numLinks"));
	
	const sourceWidth = sourceBase.attr("width");
	const sourceHeight = sourceBase.attr("height");
	
	const destinWidth = destinBase.attr("width");
	const destinHeight = destinBase.attr("height");
	
	const ElementColor = "#aba2a2"
	
	const linkButton = {
		x: 2,
		y: sourceHeight - 20,
		w: 8,
		h: 8,
		color: ElementColor,
		toolTip: "Linked Path",
		class: "linkedPath",
		lineID: lineID,
		on: deleteLink
	}
	
	const linkButtonAlt = {
		x: 2,
		y: sourceHeight - 20,
		w: 8,
		h: 8,
		color: ElementColor,
		toolTip: "Linked Path",
		class: "linkedPath",
		lineID: lineID,
		on: deleteLinkAlt
	}
	
	const createElement = function(obj, links, baseElem, mainElem, id, otherID) { 
	//console.log(baseElem);
	//obj.toolTip = `Anchor 1: ${id}, Anchor 2: ${otherID}`
	mainElem.append("rect")
        .attr("x", obj.x + (10 * links))
        .attr("y", (baseElem.attr("height")) - obj.y)
        .attr("offX", obj.x + (10 * links))
        .attr("offY", (baseElem.attr("height")) - obj.y)
        .attr("width", obj.w)
        .attr("height", obj.h)
        .attr("fill", obj.color)
		.attr("class", obj.class)
		.attr("fill", obj.color)
		.attr("linkNumber", links)
		.attr("lineID", obj.lineID)
		.attr("otherID", otherID)
		.attr("id", id)
		.on("click", obj.on)
		.append("title")
		.text(obj.toolTip);
		EventListenerList.push({evt:"click", elmt:mainElem})
	}
	
	if (parentElement == "first") {
		createElement(linkButton, numLinksSource, sourceBase, sourceElement, sourceID, destinID)
		createElement(linkButtonAlt, numLinksDestin, destinBase, destinElement, destinID, sourceID)
	} else if (parentElement == "second") {
		createElement(linkButtonAlt, numLinksSource, sourceBase, sourceElement, sourceID, destinID)
		createElement(linkButton, numLinksDestin, destinBase, destinElement, destinID, sourceID)
	} else if (parentElement == "none") {
		createElement(linkButton, numLinksSource, sourceBase, sourceElement, sourceID, destinID)
		createElement(linkButton, numLinksDestin, destinBase, destinElement, destinID, sourceID)
	}
	
	numLinksSource++;
	numLinksDestin++;
	
	sourceElement.attr("dirty", dirty)
	destinElement.attr("dirty", dirty)
	sourceElement.attr("numLinks", numLinksSource);
	destinElement.attr("numLinks", numLinksDestin);
	
	//console.log("Completed Link Button")
	
	
}

function drawLinkLine() {
	/*
	Creates the line that follows the mouse while we are in linking mode
	*/
	const connectedElement = d3.select(this.parentNode)
	
	const linkedAlready = connectedElement.attr("linked");
	
	//if (linkedAlready == "false") {
	
	const baseElement = connectedElement.select(".baseElement");
	//console.log(connectedElement);
	
	const connectedElementID = connectedElement.attr("id");
	
	const firstX = parseInt(connectedElement.attr("offX"));
	const firstY = parseInt(connectedElement.attr("offY"));
	const firstWidth = parseInt(baseElement.attr("width"));
	const firstHeight = parseInt(baseElement.attr("height"));
	
	const secondX = parseInt(d3.event.x + document.documentElement.scrollLeft);
	const secondY = parseInt(d3.event.y + document.documentElement.scrollTop);
	
	linking = true;
	baseElement.attr("linking", true)
	linkingBaseID = connectedElement.attr("id");
	//console.log(linkingBaseID)
	
	const lineGroup = svg.select("#lineGroup");
	const line = lineGroup.append("line")
		.style("stroke", "black")
		.attr("x1", firstX + (firstWidth/2))
		.attr("y1", firstY + (firstHeight/2))
		.attr("x2", secondX)
		.attr("y2", secondY)
		.attr("anchor1", "#"+connectedElementID)
		.attr("anchor2", undefined)
		.attr("z-index", 999)
		.attr("class", "followMouse")
	
	
	//} else {
		//console.log("This Element is Already Linked!!!!");
	//}
}

function createTags() {
	/*
	Populates the Tag Creation Modal with all existing tags for purpose of setting what tags can connect to.
	*/
	
	const tagsModal = d3.select("#RestrictiveTags");
	
	const createCheckbox = function(obj) {
		const inputBox = tagsModal.append("input")
        .attr("type", "checkbox")
		.attr("class", "form-check-input")
		.attr("name", obj)
		.attr("id", AlphaNumericRandom())
		.attr("class", "labelData")
		
		//console.log(ListOfAlready);
		//console.log(obj);
	}
	
	const createLabel = obj => tagsModal.append("label")
		.attr("class", "form-check-label")
		.attr("name", AlphaNumericRandom())
		.style("padding-right", "10px")
		.style("padding-left", "2px")
		.attr("class", "labelData")
		.text(obj)
		
	if (LabelList.length == 0) {
		createLabel("There are no labels to display");
	}
	
	for (let i = 0; i < LabelList.length; i++) {
		createCheckbox(i);
		createLabel(LabelList[i][0].value + " ");
		
		
	}
	
	//tagsModal.attr("isUser", isUser)
	
	$("#modalNodeCreateTags").modal()
}

function makeLabel(data, isUser, workingElement, dirty) {
	/*
	Deals with creating the User/Org Label on the Node
	Still creates the User Label on the User but it is only for Data Purposes and is not visible
	*/
	if (dirty == undefined) {
		dirty = true;
	}
	//console.log(data);
	console.log(workingElement);
	if (isUser != "on") {
		workingElement.selectAll(".LabelSpace").remove();
		workingElement.selectAll(".LabelText").remove();
	}
	let WorkingList = [];
	let toolTip = "";
	console.log("Time to make a label!");
	if (isUser == "on") {
	WorkingList = GroupList;
	toolTip = "User Group"
	console.log("Adding Group Types to a User");	
	} else {
	toolTip = "Organization Type"
	WorkingList = LabelList;	
	}
	startingX = 0;
	
	workingElement.attr("dirty", dirty);
	//console.log(WorkingList);
	
	const LabelSpace = {
		x: 2,
		y: 30,
		w: 64,
		h: 16,
		color: "white",
		on: undefined,
		toolTip: undefined,
		class: "LabelSpace"
	}
	
	const LabelText = {
		x: 4,
		y: 42,
		color: "black",
		class: "LabelText",
		toolTip: undefined
		
	}

	
	const createElement = function(obj, typeNum, startX) {
		const identifier = AlphaNumericRandom();
		workingElement.append("rect")
        .attr("x", obj.x + startX)
        .attr("y", obj.y)
        .attr("offX", obj.x + startX)
        .attr("offY", obj.y)
        .attr("width", 0)
        .attr("height", obj.h)
        .attr("fill", obj.color)
		.attr("class", obj.class)
		.attr("id", identifier)
		.attr("typeNum", typeNum)
		.on("click", obj.on)
		.append("title")
		.text(toolTip)
		const myself = d3.select("#"+identifier)
		EventListenerList.push({evt:"click", elmt:myself});
		return myself
	}
		
	const createText = function(obj, labelName, startX) { 
		const identifier = AlphaNumericRandom();
		workingElement.append("text")
		.text(labelName)
		.attr("x", obj.x + startX)
		.attr("y", obj.y)
		.attr("offX", obj.x + startX)
		.attr("offY", obj.y)
		.attr("font-size", "12px")
		.attr("font-family", "Georgia")
		.attr("text-anchor", "start")
		.attr("fill", obj.color)
		.attr("class", obj.class)
		.attr("id", identifier)
		.append("title")
		.text(toolTip)
		return d3.select("#"+identifier)
	}
	console.log("We are creating this Label")
	//console.log(WorkingList[parseInt(data[0].name)]);
	let RestrictedTags = [];
	
	for (let i = 0; i < data.length; i++) {
		const list = WorkingList[parseInt(data[i].name)]
		for (let i = 0; i < list.length; i++) {
			if (list[i].name == parseInt(list[i].name)) {
				RestrictedTags.push(LabelList[list[i].name]);
			}
		}
		console.log("We can only link to these tags");
		console.log(RestrictedTags);
		const LabelElement = createElement(LabelSpace, data[i].name, startingX);
		const TextLength = createText(LabelText, WorkingList[parseInt(data[i].name)][0].value, startingX);
		LabelElement.attr("width", (TextLength.node().getComputedTextLength())+4);
		if (isUser == "on") {
			LabelElement.style("visibility", "hidden");
			TextLength.style("visibility", "hidden");
		}
		startingX+=((TextLength.node().getComputedTextLength())+4) + 2;
		
	}
	
	workingElement.attr("LabelLinks", data.length);
	//const LabelSpaceElement = createElement(LabelSpace);
	//const LabelTextElement = createText(LabelText);
}

function listTags() {
	/*
	Populates a modal with all the tags that you can add to a selected node
	*/
	const parentElement = d3.select(this.parentNode);
	taggingElement = parentElement;
	const isUser = parentElement.attr("isUser");
	console.log(isUser);
	
	const AllLabels = parentElement.selectAll(".LabelSpace");
	const ListOfAlready = [];
	//console.log(AllLabels);
	AllLabels
	.each(function(d, i) {
		const myself = d3.select(this);
		const myName = myself.attr("typeNum");
		ListOfAlready.push(myName);
		
	});
	/*
	.each(function(d, i) {
					
					const myself = d3.select(this)
					let myLinkNumber = parseInt(myself.attr("linkNumber"));
					//console.log("My Number: " + myLinkNumber)
					
					if (myLinkNumber > currentNum) {
						myLinkNumber--;
						//console.log("Updated");
						
						//console.log("New Number: " + myLinkNumber);
						myself.attr("linkNumber", myLinkNumber);
						myself.attr("x", linkButton.x + (10 * myLinkNumber))
						myself.attr("offX", linkButton.x + (10 * myLinkNumber))
						
					}
					
					
				});
	*/
	
	const tagsModal = d3.select("#addMoreTags");
	
	const createCheckbox = function(obj) {
		const inputBox = tagsModal.append("input")
        .attr("type", "checkbox")
		.attr("class", "form-check-input")
		.attr("name", obj)
		.attr("id", AlphaNumericRandom())
		
		//console.log(ListOfAlready);
		//console.log(obj);
		if (ListOfAlready.indexOf(obj.toString()) != -1) {
			inputBox.attr("checked", true)
		}
	}
	
	const createLabel = obj => tagsModal.append("label")
		.attr("class", "form-check-label")
		.attr("name", AlphaNumericRandom())
		.style("padding-right", "10px")
		.style("padding-left", "2px")
		.text(obj)
	
	if (isUser == "on") {
		console.log("List of User Groups");
		console.log(GroupList);
		for (let i = 0; i < GroupList.length; i++) {
			createCheckbox(i);
			createLabel(GroupList[i][0].value + " ");
		}
		
		if (GroupList.length == 0) {
			createLabel("There are no groups to display");
		}
	} else {
		console.log("List of Org Types");
		console.log(LabelList);
		for (let i = 0; i < LabelList.length; i++) {
			createCheckbox(i);
			createLabel(LabelList[i][0].value + " ");
		}
		
		if (LabelList.length == 0) {
			createLabel("There are no labels to display");
		}
	}
	
	console.log(LabelList);
	
	tagsModal.attr("isUser", isUser)
	
	$("#modalNodeListTags").modal();
	
	/*
	<input type="checkbox" class="form-check-input" id="exampleCheck1" name="UserCheck">
	<label class="form-check-label" name="CheckUser">Dealership</label>
	
	<input type="checkbox" class="form-check-input" id="exampleCheck1" name="UserCheck">
	<label class="form-check-label" name="CheckUser">District</label>
	*/
}

function createNode(x, y, width, height, CreationData, id, dirty) {
	/*
	Deals with node creation
	*/
	if (dirty == undefined) {
		dirty = true;
	}
	
	const identifier =  (typeof id !== 'undefined') ?  id : AlphaNumericRandom();
	//Example Org Title
	const orgText = CreationData[0];
	const isUser = CreationData[1];
	
	//Organisation
	//X and Y values for inner rectangles are based on an offset
	
	//Inner Element Color
	const ElementColor = "#757272" //Color for the Rectangle Surrounding Visible Data
	const TextColor = "white" //Color of Text
	const BaseColor = "black" //Color of Base Element
	const SVGColor = "white"
	
	const types = [];
	
	//Rectangle for Organization Text
	const titleSpace = {
        x: 2,
        y: 2,
        w: width / 1.2,
        h: 16,
		color: ElementColor,
		class: "spaceText"
    }
	
	//Text for Organization
	const titleText = {
		txt: orgText,
		x: titleSpace.x + 2,
		y: titleSpace.y + 13,
		class: "displayText",
		color: TextColor
		
	}
	
	//Rectangle for Identifier
    const identSpace = {
        x: 2,
        y: (titleSpace.y + titleSpace.h) + 2,
        w: width / 2.5,
        h: 16,
		color: ElementColor
    }
	
	//Text for Identifier
	const identText = {
		txt: "#",
		x: width - 12,
		y: 15,
		toolTip: "ID: #"+identifier,
		color: "#666262"
	}
	
	
	//Rectangle for Settings Button
    const deletSpace = {
        x: (width - 2) - 18,
        y: (height - 2) - 18,
        w: 18,
        h: 18,
		class: "settings",
		on: deleteNode,
		toolTip: "Delete Node",
		color: ElementColor
    }
	
	
	//Rectangle for Delete Button
    const linkSpace = {
        x: (deletSpace.x - 2) - 18,
        y: deletSpace.y,
        w: 18,
        h: 18,
		toolTip: "Edit Links",
		color: ElementColor,
		on: drawLinkLine
    }
	
	const trashCan = {
		x: deletSpace.x + 2.5,
		y: deletSpace.y + 1,
		w: 16,
		h: 16,
		data: "M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z",
		on: deleteNode,
		class: "delete",
		toolTip: "Delete Node",
		opacity: 1.0
	}
	
	const editSpace = {
		x: (linkSpace.x - 2) - 18,
		y: linkSpace.y,
		w: 18,
		h: 18,
		on: editText,
		toolTip: "Edit Name",
		color: ElementColor
	}
	
	const editIcon = {
		x: editSpace.x + 1,
		y: editSpace.y + 1,
		w: 16,
		h: 16,
		data: "M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z",
		on: editText,
		class: "edit",
		toolTip: "Edit Name",
		opacity: 1.0
	}
	
	const linkIcon = {
		x: linkSpace.x + 1,
		y: linkSpace.y + 1,
		w: 16,
		h: 16,
		data: "M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z",
		class: "link",
		toolTip: "Edit Links",
		on: drawLinkLine,
		opacity: 1.0
	}
	
	const tagSpace = {
		x: (editSpace.x - 2) - 18,
		y: linkSpace.y,
		w: 18,
		h: 18,
		on: undefined,
		toolTip: "Edit Tags",
		color: ElementColor
	}
	
	const tagIcon = {
		x: tagSpace.x + 1,
		y: tagSpace.y + 1,
		w: 16,
		h: 16,
		data: "M0 252.118V48C0 21.49 21.49 0 48 0h204.118a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882L293.823 497.941c-18.745 18.745-49.137 18.745-67.882 0L14.059 286.059A48 48 0 0 1 0 252.118zM112 64c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z",
		on: listTags,
		class: "tags",
		toolTip: "Edit Tags",
		opacity: 1.0
	}
	
	const orgIcon = {
		x: 1,
		y: height - 17,
		w: 16,
		h: 16,
		on: undefined,
		class: "user",
		toolTip: "Organization",
		opacity: 0.5,
		data: "M436 480h-20V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v456H12c-6.627 0-12 5.373-12 12v20h448v-20c0-6.627-5.373-12-12-12zM128 76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76zm0 96c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40zm52 148h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12zm76 160h-64v-84c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v84zm64-172c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40z"
	
	}
	
	const userIcon = {
		x: 1,
		y: height - 17,
		w: 16,
		h: 16,
		on: undefined,
		class: "user",
		toolTip: "User",
		opacity: 0.5,
		data: "M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
		
		
	}
	
	//Create Base Element
	
	const g = svg.append("g")
		.attr("id", identifier)
		.attr("transform", `translate(${x}, ${y})`)
		.attr("offX", x)
		.attr("offY", y)
		.attr("linked", "false")
		.attr("class", "draggable")
		.attr("numLinks", 0)
		.attr("isUser", isUser)
		.attr("LabelLinks", 0)
		.attr("CanLink", true)
		.attr("dirty", dirty)
		
		
	console.log(identifier);
	g.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("offX", 0)
		.attr("offY", 0)
		.attr("width", width)
		.attr("height", height)
		.attr("fill", BaseColor)
		.attr("class", "baseElement")
		.attr("linking", false)
		.on("click", clickHandler)
	
	EventListenerList.push({evt:"click", elmt:g})
	const createElement = function(obj) {
		const identifier = AlphaNumericRandom();
		g.append("rect")
        .attr("x", obj.x)
        .attr("y", obj.y)
        .attr("offX", obj.x)
        .attr("offY", obj.y)
        .attr("width", obj.w)
        .attr("height", obj.h)
        .attr("fill", obj.color)
		.attr("class", obj.class)
		.attr("id", identifier)
		.on("click", obj.on)
		.append("title")
		.text(obj.toolTip)
		const myself = d3.select("#"+identifier);
		EventListenerList.push({evt:"click", elmt:myself})
		return myself
	}
	
	const createText = function(obj) {
		const identifier = AlphaNumericRandom();
		g.append("text")
		.text(obj.txt)
		.attr("x", obj.x)
		.attr("y", obj.y)
		.attr("offX", obj.x)
		.attr("offY", obj.y)
		.attr("font-size", "15px")
		.attr("font-family", "Georgia")
		.attr("text-anchor", "start")
		.attr("fill", obj.color)
		.attr("id", identifier)
		.attr("class", obj.class)
		.append("title")
		.text(obj.toolTip)
		return d3.select("#"+identifier);
	}
	
	//For drawing SVG Vector Graphics
	const createPath = function(obj){
		const identifier = AlphaNumericRandom();
		g.append("path")
		.attr("d", obj.data)
		.attr("transform", `translate(${obj.x}, ${obj.y}) scale(${obj.w / 512}, ${obj.h / 512})`)
		.attr("x", obj.x)
		.attr("y", obj.y)
		.attr("offX", obj.x)
		.attr("offY", obj.y)
		.attr("fill", SVGColor)
		.attr("class", obj.class)
		.attr("isUser", isUser)
		.attr("opacity", obj.opacity)
		.attr("id", identifier)
		.on("click", obj.on)
		.append("title")
		.text(obj.toolTip)
		const myself = d3.select("#"+identifier);
		EventListenerList.push({evt:"click", elmt:myself})
	}
		
	const titleElement = createElement(titleSpace)
	const titleTextElem = createText(titleText)
	
	const TextLength = titleTextElem.node().getComputedTextLength();
	titleElement.attr("width", TextLength + 4);
	const identTextElem = createText(identText)
    const linkElement = createElement(linkSpace)
    const deletElement = createElement(deletSpace)
	const editElement = createElement(editSpace)
	if (isUser != "on") {
		const tagElement = createElement(tagSpace);
	}
	
	const trashCanElement = createPath(trashCan);
	const linkIconElement = createPath(linkIcon);
	const editIconElement = createPath(editIcon);
	if (isUser != "on") {
		const tagIconElement = createPath(tagIcon);
	}
	let userIconElement;
	if (isUser == "on") {
		userIconElement = createPath(userIcon);
	} else  {
		userIconElement = createPath(orgIcon);
	}
	
	const FinalNode = {type:"", name:"", identifier:"", labels:"", anchor1:"", anchor2:"", x:0, y:0, isUser:"off"};
	FinalNode.type = "Organization";
	FinalNode.name = orgText;
	FinalNode.identifier = identifier;
	FinalNode.labels = "";
	FinalNode.anchor1 = "";
	FinalNode.anchor2 = "";
	FinalNode.isUser = isUser;
	
	dragHandler(g);
	CompleteList.push(FinalNode);
	//console.log(GetList());
}

function GetList() {
	return CompleteList;
}

function deleteNode()
{
	//This will delete the selected Element along with any lines attached to it
	
	const parentElement = this.parentNode;
	const selectedParent = d3.select(parentElement);
	//console.log(selectedParent);
	
	const parentID = selectedParent.attr("id");
	
	//We also need to grab the line if one exists and delete it
	const allLinkButtons = d3.selectAll(".linkedPath")
	const allLines = d3.selectAll("line");
	allLines
		.each(function(d, i) {
			const myself = d3.select(this);
			
			const firstBaseElementID = myself.attr("anchor1");
			const secondBaseElementID = myself.attr("anchor2");
			//console.log(firstBaseElementID);
			if (firstBaseElementID == "#" + parentID || secondBaseElementID == "#" + parentID) {
				myself.remove();
				myID = myself.attr("id");
				allLinkButtons
					.each(function(d, i) {
						const meHere = d3.select(this);
						const lineID = meHere.attr("lineID");
						if (lineID == myID) {
								meHere.dispatch("click");
						}
					});
			}
			
		});
		
	const allUserSpaceText = d3.selectAll("text.userLineSpaceText");
		allUserSpaceText
			.each(function(d, i) {
				
				const myself = d3.select(this);
				const myParent1 = myself.attr("parent1");
				const myParent2 = myself.attr("parent2");
				if (myParent1 == parentID || myParent2 == parentID) {
					myself.remove();
				}
				
				
			});
			
		const allOrgSpaceText = d3.selectAll("text.orgLineSpaceText");
		allOrgSpaceText
			.each(function(d, i) {
				
				const myself = d3.select(this);
				const myParent1 = myself.attr("parent1");
				const myParent2 = myself.attr("parent2");
				if (myParent1 == parentID || myParent2 == parentID) {
					myself.remove();
				}
				
			});
		
	
	
	
	selectedParent.remove();
}

//Validate the Links between two elements using the Tags
function validateLink(firstElementID, secondElementID) {
	//Since we only have to validate against Organization Labels this makes it simple
	const firstElement = d3.select("#"+firstElementID);
	const secondElement = d3.select("#"+secondElementID);
	
	const isUserFirst = firstElement.attr("isUser");
	const isUserSecond = secondElement.attr("isUser");
	
	//console.log(isUserFirst);
	//console.log(isUserSecond);
	
	const AllLabelsFirst = firstElement.selectAll(".LabelSpace");
	const AllLabelsSecond = secondElement.selectAll(".LabelSpace");
	
	let FirstTagData = [];
	let SecondTagData = [];
	AllLabelsFirst
		.each(function(d, i) {
			const myself = d3.select(this);
			const inList = myself.attr("typeNum");
			if (isUserFirst == "on") {
				FirstTagData.push(GroupList[inList]);
			} else {
				FirstTagData.push(LabelList[inList]);
			}
			
		});

	AllLabelsSecond
		.each(function(d, i) {
			const myself = d3.select(this);
			const inList = myself.attr("typeNum");
			if (isUserSecond == "on") {
				SecondTagData.push(GroupList[inList]);
			} else {
				SecondTagData.push(LabelList[inList]);
			}
			
		});
	
	//console.log("First Tag Data");
	//console.log(FirstTagData);
	//console.log("Second Tag Data");
	//console.log(SecondTagData);
	let RestrictedTagsFirst = [];
	for (let i = 0; i < FirstTagData.length; i++) {
		let data = FirstTagData[i];
		//console.log("The Data");
		//console.log(data);
		for (let j = 0; j < data.length; j++) {
			
            if (!isNaN(data[j].name)) {
                console.log(data[j].name);
                //console.log(GroupList[data[j].name])
                RestrictedTagsFirst.push(LabelList[data[j].name]);

            }
		}
	}
	
	let RestrictedTagsSecond = [];
	for (let i = 0; i < SecondTagData.length; i++) {
		let data = SecondTagData[i];
		console.log("The Data");
		console.log(data);
		for (let j = 0; j < data.length; j++) {
			//console.log("Piece of Data");
            //console.log(data[j]);
            if (!isNaN(data[j].name)) {
                console.log(data[j].name);
            	RestrictedTagsSecond.push(LabelList[data[j].name]);
            }
		}
	}
	//console.log("First Element Restricted Tags");
	//console.log(RestrictedTagsFirst);
	//console.log("Second Element Restricted Tags");
	//console.log(RestrictedTagsSecond);
	
	//Test for Tagability
	let AllowTag = false;
	let AllowFirstParent = false;
	let AllowSecondParent = false;
	if (isUserFirst == "on" || (isUserFirst == undefined && isUserSecond == undefined)) {
		for (let i = 0; i < RestrictedTagsFirst.length; i++) {
			const RestrictedTagName = RestrictedTagsFirst[i][0].value
			//console.log("Second Tag Data");
			//console.log(SecondTagData)
			//console.log("We here");
			for (let j = 0; j < SecondTagData.length; j++) {
			    
				//console.log(SecondTagData[j][0].value);

				if (RestrictedTagName == SecondTagData[j][0].value) {
					AllowTag = true;
					AllowSecondParent = true;
					if (isUserFirst != "on" && isUserSecond != "on") {
						if (firstElement.attr("CanLink") == "false") {
							return [false, false, false];
						}
					}
				}
			}
		
		}
	}
	
	if (isUserSecond == "on" || (isUserFirst == undefined && isUserSecond == undefined)) {
		for (let i = 0; i < RestrictedTagsSecond.length; i++) {
			const RestrictedTagName = RestrictedTagsSecond[i][0].value
			//console.log("First Tag Data");
			//console.log(FirstTagData);
			//console.log("We also here");
			for (let j = 0; j < FirstTagData.length; j++) {
				

				if (RestrictedTagName == FirstTagData[j][0].value) {
					AllowTag = true;
					AllowFirstParent = true;
					if (isUserFirst != "on" && isUserSecond != "on") {
						if (secondElement.attr("CanLink") == "false") {
							return [false, false, false];
						}
					}
				}
			}
		
		}
	}

	if (AllowTag == true) {

		console.log("We can connect to this element");
	} else {

		console.log("We can not connect to this element");
	}
	
	
	
	
	/*
	console.log("We are creating this Label")
	console.log(WorkingList[parseInt(data[0].name)]);
	let RestrictedTags = [];
	
	for (let i = 0; i < data.length; i++) {
		const list = WorkingList[parseInt(data[i].name)]
		for (let i = 0; i < list.length; i++) {
			if (list[i].name == parseInt(list[i].name)) {
				RestrictedTags.push(LabelList[list[i].name]);
			}
		}
		console.log("We can only link to these tags");
		console.log(RestrictedTags);
		const LabelElement = createElement(LabelSpace, data[i].name, startingX);
		const TextLength = createText(LabelText, WorkingList[parseInt(data[i].name)][0].value, startingX);
		LabelElement.attr("width", TextLength + 4);
		startingX+=(TextLength+4) + 2;
		
	}
	*/
	return [AllowTag, AllowFirstParent, AllowSecondParent];
}

let AddUserWaiting = false;

//Link two g elements together via their Unique Identifier
function linkPaths(firstElementID, secondElementID) {
	/*
	Deals with creating the link between two nodes,
	*/
	const identifier = AlphaNumericRandom();
	const firstElem = d3.select("#"+firstElementID);
	const secondElem = d3.select("#"+secondElementID);
	
	const firstBaseElem = firstElem.select(".baseElement");
	const secondBaseElem = secondElem.select(".baseElement");
	
	const firstWidth = parseInt(firstBaseElem.attr("width"));
	const firstHeight = parseInt(firstBaseElem.attr("height"));
	const secondWidth = parseInt(secondBaseElem.attr("width"));
	const secondHeight = parseInt(secondBaseElem.attr("height"));
	
	const firstX = parseInt(firstElem.attr("offX"));
	const firstY = parseInt(firstElem.attr("offY"));
	const secondX = parseInt(secondElem.attr("offX"));
	const secondY = parseInt(secondElem.attr("offY"));
	
	
	const firstUserCheck = firstElem.attr("isUser");
	const secondUserCheck = secondElem.attr("isUser");
	
	const LabelLinksFirst = firstElem.attr("LabelLinks");
	const LabelLinksSecond = secondElem.attr("LabelLinks");
	
	let disableParent = false;
	
	if (firstUserCheck == "on" && secondUserCheck == "on") {
		console.log("Can not link these two together!")
		return [false];
	}
	
	if (firstUserCheck == "on") {
		disableParent = true;
		if (LabelLinksFirst == 0) {
			console.log("A User Group must be Specified for the Link");
			return [false];
		}
	}
	
	if (secondUserCheck == "on") {
		disableParent = true;
		if (LabelLinksSecond == 0) {
			console.log("A User Group must be Specified for the Link");
			return [false];
		}
	}
	firstElem.attr("linked", "true");
	secondElem.attr("linked", "true");
	
	
	//We must make sure that the link is valid based on data about the nodes (Depending on the applied tags)
	const continueTag = validateLink(firstElementID, secondElementID);
	
	if (continueTag[0] == true) {
		const lineGroup = svg.select("#lineGroup");
		const line = lineGroup.append("line")
			.style("stroke", "black")
			.attr("x1", firstX + (firstWidth/2))
			.attr("y1", firstY + (firstHeight/2))
			.attr("x2", secondX + (secondWidth/2))
			.attr("y2", secondY + (secondHeight/2))
			.attr("anchor1", "#"+firstElementID)
			.attr("anchor2", "#"+secondElementID)
			.attr("z-index", 999)
			.attr("class", "linkedLine")
			.attr("dirty", true)
			.attr("id", identifier);
		
		line.raise();
		const FinalNode = {type:"", name:"", identifier:"", labels:"", anchor1:"", anchor2:""};
		FinalNode.type = "Line";
		FinalNode.name = "";
		FinalNode.identifier = identifier;
		FinalNode.labels = "";
		FinalNode.anchor1 = `#${firstElementID}`;
		FinalNode.anchor2 = `#${secondElementID}`;
		let ParentElement = "none"
		let OrgText = "";
		if (disableParent == false) {
			if (continueTag[1] == true) {//First Element Parent
				ParentElement = "first"
				OrgText = 
				console.log(ParentElement);
				console.log("First Element Parent");
			} else {//Second Element Parent
				ParentElement = "second"
				console.log(ParentElement);
				console.log("Second Element Parent");
			}
		}
		CompleteList.push(FinalNode);
		//console.log(GetList());
		return [identifier, ParentElement];
	} else {
		return [false];
	}	
}

function initNode() {
	$("#modalNodeCreateOrg").modal()
}

function generateLink(fileName, data) {
  var link = document.createElement('a'); // Create a element.
  link.download = fileName; // Set value as the file name of download file.
  link.href = data; // Set value as the file content of download file.
  return link;
}

function saveData() {

	initData.store();
}

function downloadSVG() {
	let svg = d3.select("#designerID").node();
    var svgData = svg.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function newSVG() {
	$("#modalNewSVG").modal();
	/*let allElement = d3.selectAll("*");
	allElement.on("click", null);
	allElement.on("hidden.bs.modal", null)
	allElement.on("mousemove", null)
	allElement.on("start", null)
	allElement.on("drag", null)
	$("#nodeCreateForm").unbind();
	$("#modalNodeCreateOrg").unbind();
	$("#nodeCreateTagsForm").unbind();
	$('#modalNodeCreateTags').unbind();
	$('#modalNodeListTags').unbind();
	svg.remove();
	uiSVG.remove();
	init(ThisSelector, initData, 3000, 3000);*/
}

function aboutTool() {
	//Todo Code
	console.log("About Tool")
	$("#modalAboutTool").modal();
}

function initUI() {
	/*
	Intializes the User Interface which is a static object
	*/
	addX = 40;
	const newSVGButton = {
		x: 8,
		y: 8,
		w: 32,
		h: 32,
		data: "M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z",
		SVGColor: "white",
		on: newSVG,
		toolTip: "New SVG"
	}

	const newNodeButton = {
		x: 40,
		y: 8,
		w: 32,
		h: 32,
		data: "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z",
		SVGColor: "white",
		on: initNode,
		toolTip: "New Node"
	}
	
	const saveDataButton = {
		x: 80,
		y: 8,
		w: 32,
		h: 32,
		data: "M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z",
		SVGColor: "white",
		on: initData.store,
		toolTip: "Save Data"
		
	}
	
	const loadDataButton = {
		x: 120,
		y: 8,
		w: 32,
		h: 32,
		data: "M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z",
		SVGColor: "white",
		on: initData.load,
		toolTip: "Load Data"
	}
	
	const tagsCreateButton = {
		x: 164,
		y: 8,
		w: 32,
		h: 32,
		data: "M497.941 225.941L286.059 14.059A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v204.118a48 48 0 0 0 14.059 33.941l211.882 211.882c18.744 18.745 49.136 18.746 67.882 0l204.118-204.118c18.745-18.745 18.745-49.137 0-67.882zM112 160c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm513.941 133.823L421.823 497.941c-18.745 18.745-49.137 18.745-67.882 0l-.36-.36L527.64 323.522c16.999-16.999 26.36-39.6 26.36-63.64s-9.362-46.641-26.36-63.64L331.397 0h48.721a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882z",
		SVGColor: "white",
		on: createTags,
		toolTip: "Add Tags/Groups"
		
	}
	
	const downloadSVGButton = {
		x: 212,
		y: 8,
		w: 32,
		h: 32,
		data: "M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z",
		SVGColor: "white",
		on: downloadSVG,
		toolTip: "Download SVG"
	}
	
	const aboutButton = {
		x: 252,
		y: 8,
		w: 32,
		h: 32,
		data: "M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z",
		SVGColor: "white",
		on: aboutTool,
		toolTip: "About"
	}
	
	const createPath = function(obj) {
		const identifier = AlphaNumericRandom();
		uiIdentifier.append("path")
		.attr("d", obj.data)
		.attr("transform", `translate(${obj.x}, ${obj.y}) scale(${obj.w / 512}, ${obj.h / 512})`)
		.attr("x", obj.x)
		.attr("y", obj.y)
		.attr("offX", obj.x)
		.attr("offY", obj.y)
		.attr("fill", obj.SVGColor)
		.attr("class", obj.class)
		.attr("id", identifier)
		//.style("position", "fixed")
		.on("click", obj.on)
		.append("title")
		.text(obj.toolTip)
		const myself = d3.select("#"+identifier);
		EventListenerList.push({evt:"click", elmt:myself})
	}

	const uiIdentifier = d3.select("#uiMenu");
	//console.log(uiIdentifier);
	
	//Time to create some UI Elements
	uiIdentifier.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 1970)
		.attr("height", 48)
		.attr("fill", "black")
		//.style("position", "fixed")
	uiIdentifier.style("position", "sticky")
		
	createPath(newSVGButton)
	createPath(newNodeButton);
	createPath(saveDataButton);
	createPath(loadDataButton);
	createPath(tagsCreateButton);
	createPath(downloadSVGButton)
	createPath(aboutButton);
	
	//window.addEventListener("resize", adjustUIScale, false);
  
	/*function adjustUIScale() {
        console.log(uiIdentifier)
		uiSVG
		.attr("transform", `scale(${window.devicePixelRatio})`);
		
		console.log("Rawr");
    }*/
        
}

Array.prototype.IndexOfObject = function(input) {
	/*
	I believe this finds the index of an Array that has an Object inside of it And the input is in one of the Objects
	*/
	const arr = this;
	for (let i = 0; i < arr.length; i++) {
	//Iterate over the base array
		for (let key in arr[i]) {
			if(arr[i][key] == input) {
				return i;
			}
		}
	}
	
	return -1;
}

function initForms() {
	/*
	Initializes the Form buttons so that when you click they react
	*/
	$(document).ready(function() {
		$("#nodeCreateForm").submit(function(event) {
		const data = $("#nodeCreateForm").serializeArray();
		//console.log(data);
		
		let CreationData = [];
		for (var i = 0; i < data.length; i++) {
			CreationData[i] = data[i].value;
		}
		//const Checked = data[1].value;
		//console.log(CreationData);
		createNode(45, 55, 250, 100, CreationData);
		
		event.preventDefault();
		$("#modalNodeCreateOrg").modal("hide");
		});
		
		$("#nodeLoadFileForm").change(function(event) {
			
			const data = event.target.files[0].path;
			//console.log(data);
			
			event.preventDefault();
		});
		
		$("#nodeNewSVG").submit(function(event) {
			$("#modalNewSVG").modal("hide");
			const data = $("#nodeNewSVG").serializeArray();
			console.log(data);
			console.log(EventListenerList)
			for (let i = 0; i < EventListenerList.length; i++) {
				let cur_evt = EventListenerList[i].evt;
				let cur_elmt = EventListenerList[i].elmt;
				
				cur_elmt.on(cur_evt, null);
			}
			
			EventListenerList = [];
			
			$("#nodeCreateForm").unbind();
			$("#modalNodeCreateOrg").unbind();
			$("#nodeCreateTagsForm").unbind();
			$('#modalNodeCreateTags').unbind();
			$('#modalNodeListTags').unbind();
			
			//dragHandler.on("start", null);
			//dragHandler.on("drag", null);
			
			svg.remove();
			uiSVG.remove();
			//bootstrapModal.remove();
			const svg_height = data[0].value;
			const svg_width = data[1].value;
			init(ThisSelector, initData, svg_height, svg_width);
			
			
			event.preventDefault();
			
		});
		
		$("#nodeCreateTagsForm").submit(function(event) {
			const data = $("#nodeCreateTagsForm").serializeArray();
			//console.log(data);
			let CreationData = [];
			for (var i = 0; i < data.length; i++) {
				CreationData[i] = data[i];
			}
			
			const isUser = CreationData.IndexOfObject("UserCheck");
			const TagNameIndex = CreationData.IndexOfObject("TagName");
			let TagName = "";
			//console.log(TagNameIndex);
			if (TagNameIndex != -1) {
				TagName = CreationData[0].value;
			}
			//const Checked = data[1].value;
			//console.log(CreationData);
			//createNode(45, 55, 250, 100, CreationData);
			if (TagName != "") {
				if (isUser != -1) {
					//console.log(CreationData);
					GroupList.push(CreationData);
					console.log("New User Group Added!");
				} else {
					//console.log(CreationData);
					LabelList.push(CreationData);
					console.log("New Organization Label Added!");
				}
			} else {
				console.log("No Tag Name was Specified");
			}
			
			//console.log(LabelList); 
			const AllLabelData = d3.select("#RestrictiveTags").selectAll(".labelData");
			AllLabelData.remove();
			//console.log(CreationData);
			event.preventDefault();
			
			$("#modalNodeCreateTags").modal("hide");
		});
		
		$('#modalNodeCreateTags').on('hidden.bs.modal', function() {
			const AllLabelData = d3.select("#RestrictiveTags").selectAll(".labelData");
			AllLabelData.remove();
		});
		
		$('#modalNodeListTags').on('hidden.bs.modal', function () {
			
			const data = $("#nodeListTagsForm").serializeArray();
			const user = d3.select("#addMoreTags").attr("isUser")
			//console.log("Length: " + data.length);
			for (var i = 0; i < data.length; i++) {
				if (user == "on") {
					//console.log(GroupList[data[i].name])
				} else {
					//console.log(LabelList[data[i].name])
				}
			}
			
			//if (data.length > 0) {
				makeLabel(data, user, taggingElement);
			//}
			/*let CreationData = [undefined, "off"];
			for (var i = 0; i < data.length; i++) {
				CreationData[i] = data[i].value;
			}
			//const Checked = data[1].value;
			//console.log(CreationData);
			//createNode(45, 55, 250, 100, CreationData);
			
			if (CreationData[1] == "on") {
				GroupList.push(CreationData);
				console.log("New User Group Added!");
			} else {
				LabelList.push(CreationData);
				console.log("New Organization Label Added!");
			}*/
			
			d3.select("#addMoreTags").selectAll("*").remove();
		});
		
		
		console.log("Document Ready");
	});
}

function initDefs() {
	/*
	Creates a Filter Defintion for the User Labels
	*/
	const thisDef = d3.select("#definitions");
	
	const filter = thisDef.append("filter")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 1)
		.attr("height", 1)
		.attr("id", "solid")
	filter.append("feFlood")
		.attr("flood-color", "white")
	filter.append("feComposite")
		.attr("in", "SourceGraphic")
		.attr("operator", "xor")
}


function init(selector, initData, width, height) {
	/*
	Initializer for the entire Plugin, Is also called when creating a new blank SVG
	*/
	
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const svg_h = urlParams.get("height") ? urlParams.get("height") : height;
	const svg_w = urlParams.get("width") ? urlParams.get("width") : width;
	CompleteList = []; //Complete list of User Groups and Org Types
	GroupList = []; //User Groups
	LabelList = []; //Organization Types
	dragok = false; //Are we dragging
	
	GlobalIDList = []; //List of all AlphaNumeric Identifiers 

	GlobalParentUser = "off"; //Capture Values for a User Check
	GlobalSourceUser = "off"; //Capture Values for a User Check

	taggingElement = undefined; //Capture Value for Tagging an Element

	offset = {x: 0, y: 0}; //Capture Values for Mouse Offset
	linking = false; //Are we trying to link an element?

	linkingBaseID = undefined; //Capture Value for Linking Paths
	
	const thisSelector = d3.select(selector);
	
	let uiWidth = parseInt(thisSelector.style("width") || thisSelector.style("width") || 1920);
	let uiHeight = 48;
	
	uiSVG = thisSelector.append('svg')
			.attr("id", "uiID")
			.attr("viewBox", `0 0 ${uiWidth} ${uiHeight}`)
			.attr("width", uiWidth)
			.attr("height", uiHeight)
			.style("position", "fixed")
	
	svg = thisSelector.append('svg')
			.attr("id", "designerID")
			.attr("width", svg_w)
			.attr("height", svg_h)
			.style("border-bottom", "3px solid red")
			.style("border-right", "3px solid red")
			.on("mousemove", MouseMoveCapture)
	
	svg.append("g")
		.attr("id", "lineGroup")
	
	svg.append("g")
		.attr("id", "userSpaceGroup")
	
	uiSVG.append("g")
		.attr("id", "uiMenu")
	dragHandler = d3.drag()
			.on('start', dragStart)
            .on('drag', dragged);
			
	
			
	svg.append("defs")
		.attr("id", "definitions");
	
	
	initUI();
	initDefs();
	
		$(document).ready(function(){
			if (onStartup == false) {
				initData.initExtra()
				initModals();
				onStartup = true;
			}
			initForms();
		});
}
console.log(initData)
init(ThisSelector, initData, initData.height, initData.width);
};(jQuery);


