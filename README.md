# PaperBits Demo

This repository shows an example of how using PaperBits you can enable advanced content authoring tools in your web apps.

Please explore the [DEMO](https://paperbits.io), check out the [documentation](https://github.com/paperbits/paperbits-knockout/wiki) and [samples repository](https://github.com/paperbits/paperbits-samples).

## Basic functionality overview
PaperBits is all about widgets and editors. Widgets are reusable blocks that make up the page content and Editors are tools that help to manage what and how widgets display.

A widget can be switched to **editing mode** by double clicking on it. This brings up an editor where you can change widget's properties as you need.
 

### Text block
The simplest and most used element on a page is the text block:
```html
<paper-textblock>
    Lorem ipsum dolor sit amet, nibh nec vitae ut magnis...
</paper-textblock>
```
The editor for text block widget supports common set of text styling features like alignment, font weight, lists, etc., and, as the project moves forward, its functionality will be extended with other useful tools like real-time collaboration, text-proofing, leaving comments, etc.  
![switch_edit.gif](https://firebasestorage.googleapis.com/v0/b/paperbits-cdn.appspot.com/o/switch-edit.gif?alt=media&token=4e43d530-4dbb-492f-8876-f80d3ba0818d "switch_edit.gif")
   

### Picture

```html
<paper-picture src="https://paperbits.io/images/pen-fight.svg" layout="noframe"></paper-picture>
```
The easiest way to add a picture to the content is to drag and drop a file on a page or paste it from the clipboard. New files appear as a thumbnail in a small window called "drop bucket". From there you can either drag it directly to the content or click "upload" button to place it into media library for later use. 

![switch_edit.gif](https://firebasestorage.googleapis.com/v0/b/paperbits-cdn.appspot.com/o/picture-upload.gif?alt=media&token=15baf6c8-7bb5-44ef-b946-16125d841b2d "picture_upload.gif")

Another way is to drag the picture widget from "widgets library" and specify an image using the editor.

![switch_edit.gif](https://firebasestorage.googleapis.com/v0/b/paperbits-cdn.appspot.com/o/picture_uploadpicture_upload_from_lib.gif?alt=media&token=cc9a6487-5db8-4e5a-9fc9-9d01bf567f9f "picture_uploadpicture_upload_from_lib.gif")


### Layout
```html
<paper-layout>...</paper-layout>
```
The layout is another widget that represents the responsive grid, cells of which are also widgets making up its rows and columns. The cells can be rearranged withing the grid using same drag and drop interface.
### Navigation
< TO BE FINISHED >

### Drop bucket
< TO BE FINISHED >
### Pages
< TO BE FINISHED >









