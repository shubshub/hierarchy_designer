# Hierarchy Designer
an organizational hierarchy designer made in jQuery and d3.js

# Dependencies
```
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"></link>
<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
<script src="https://d3js.org/d3.v5.js"></script>
<script src="./hierachy_plugin.js"></script>
<div class="your class name here">This is where your SVG window will go when you initialize the plugin</div>
```

# Initializing
```
$("Your Div Element Identifier Goes Here").hierarchyDesigner({
		load: function() {
		//Your Load Code Here
		},
		store: function() {
		//Your Save Code Here
		},
		initExtra: function() {
		//Code here for anything extra you need
		//Usually stuff you would instantiate to work in conjunction with your own save and load
		},
		height:1920, //Whatever integer here
		width:1080 //Whatever integer here
	});
```
Download the codebase and run index.html open up the developer console and paste in
```
$(".hierarchy_designer").hierarchyDesigner({});
```
and hit enter to test out the tool yourself (Will use LocalStorage for save and load, Feel free to change this with config options)
You will have to read the code comments to learn how to write your own save and load that will play nice with the plugin code
# Using the tool
![User Interface](https://i.ibb.co/94GPftK/chrome-5td-L1j-ODef.png "User Interface")
Using this tool is simple, From left to right the interface is as follows
New SVG | Create Node | Save Data | Load Data | Create Tags | Download SVG | About Tool

#### New SVG
![New SVG](https://i.ibb.co/71HwdNS/chrome-f9-PZgcf-APd.png "New SVG")
to create a new SVG enter the Height and Width and hit Submit

#### Create Node
![Create Node](https://i.ibb.co/ZGgwDKT/chrome-4v-FTRLW7jz.png "Create Node")
to create a new node enter the name of the Organization/User and then check the box if you wish to create a User and hit submit

#### Saving Data
to save data just hit the save button, further functionality of this may be extended in the configuration options

#### Loading Data
to load data just hit the load button, further functionality of this may be extended in the configuration options

#### Creating Tags
![Tag Creation](https://i.ibb.co/3k7frvb/chrome-w-Zb9d-Nt-A4c.png "Tag Creation")
to create a tag enter the name in the box and select the first checkbox to make a User Group
You can select which tags are valid connection (Nodes with the created tag can connect to other nodes with these specified tags)
If the node is an organization then you are selecting which tags are the parent of this tag

#### Downloading SVG
to download SVG just hit the download button and the SVG will be saved to an SVG file you can save it wherever you want

#### Node Manipulation
![Node Manipulation](https://i.ibb.co/tcgKxvw/chrome-WGb3-Ui-M8p-J.png "Node Manipulation")
The UI of the Node is as follows from top to bottom
Organization/User Name, Delete Link Buttons, Organization Types, Node Settings
![Node UI](https://i.ibb.co/kmBjJSH/chrome-f-Zqlmu-Ce6z.png "Node UI")
Node UI left to right is Edit Tags, Edit Name, Link, Delete
Users do not have the Edit Tags option on the Node

#### Add/Remove Node Tags
Click the Edit tags Button on the specified node
![Edit Tags](https://i.ibb.co/rMWFP4Z/chrome-ukm-NEm-A3-Ew.png "Edit Tags")
Select all the Organization Types you wish to add to the node they will appear on the node

#### Edit Node Name
Click the Edit Name button on the specified node
![Edit Name](https://i.ibb.co/cwMqM4z/chrome-k5zc4-M0e-Zi.png "Edit Name")
Enter a new name and hit submit the nodes name will be updated

#### Linking Nodes together
Click the Link Button on the specified node
You will now have a line that will follow to the mouse pointer, Click on another node that you wish to link with
If both nodes are organizations they will link as Parent and Child assuming they have valid tags
If one of the nodes is a User you will be presented with this window
![User Tag Add](https://i.ibb.co/6JYhY6R/chrome-5-ZR23y-Wf-OB.png "User Tag Add")
Select a valid tag that can connect to the Organization
a link will be created between the Organization and User with the User Tag displayed on the connection

#### Deleting Nodes
Just click the delete button on the specified node and it will be deleted along with all its linked connection severed

#### Deleting a Link
Click one of the gray squares below the Organization name that corrosponds with the link you wish to remove



#### About Tool
Developed by Shubshub
Vector Icon License: [FontAwesome Free License](https://fontawesome.com/license/free "FontAwesome Free License")
Tested on Chrome 91.0.4472.114, Firefox 89.0.2, Edge 91.0.864.59
Current Version: 1.0.0