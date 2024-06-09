
let imgCon = document.getElementById("imgCon");
let btnReset = document.getElementById("btnReset");

let btnInput = document.getElementById("btnInput");

let btnOutput = document.getElementById("btnOutput");
let btnQuality = document.getElementById("btnQuality");
let sliderQuality = document.getElementById("sliderQuality");
let btnProcess = document.getElementById("btnProcess");
let filetype = document.getElementById("filetype");

btnInput.addEventListener("click", () => {
	getTheFile();
})

btnQuality.addEventListener('input', () => {
	sliderQuality.value = btnQuality.value;
})

sliderQuality.addEventListener('input', () => {
	btnQuality.value = sliderQuality.value;
})

btnOutput.addEventListener("click", () => {

getDir();
	
})

btnReset.addEventListener("click", () => {
	
	window.location.reload();
		
})

let pc_dir;

async function getDir() {
	pc_dir = await window.showDirectoryPicker({ mode: 'readwrite',  startIn: 'pictures' });
}


let fileSave = [];

const imgOpt = 
{
	types: [
	{
		description: "Images",
		accept: {
			"image/*": [".png", ".webp", ".jpeg", ".jpg"],
		},
	},
	],
	excludeAcceptAllOption: true,
	multiple: true
};

let bildId = 0;


async function getTheFile() 
{
	
	const fileHandle = await window.showOpenFilePicker( imgOpt, { startIn: 'pictures' } );
	
	
	for (const fileHandles of fileHandle) 
	{
		
		const fileData = await fileHandles.getFile();
		
		fileData.src = URL.createObjectURL(fileData);
		 
		let z = new Image();
		z.src = fileData.src;
		
		z.onload = () => 
		{
		fileData.height = z.height;
		fileData.width = z.width;	
		}
		
		fileSave.push(fileData)
			
		const div = document.createElement("div");
		const ele = document.createElement("p");
		ele.innerHTML = fileHandles.name + " // Filesize: " + (fileData.size/1024).toFixed(2) + " KiB"
		div.appendChild(ele);
		const ele2 = document.createElement("img");
		
		ele2.id = bildId;
		bildId ++;
		
		ele2.src = fileData.src; 
		ele2.height = 80;
		ele2.width = 80;
		div.appendChild(ele2);
		const ele3 = document.createElement("a");
		ele3.innerHTML = "x";
		ele3.href = "#";
		ele3.style.fontSize = 1.45 + "rem";
		ele3.onclick = () => {
							ele3.closest("div").remove(); 
							fileSave.splice(ele2.id, ele2.id + 1);
							URL.revokeObjectURL(ele2);			
							 };
		div.appendChild(ele3);
		imgCon.appendChild(div);
	} 

}
 
btnProcess.addEventListener('click', () => 
 {

	if(pc_dir !== undefined) {
		compress(fileSave, btnQuality.value, filetype.value);
	} else {
		alert("First you have to choice an output dir!");
		getDir();
	}
    
});

function compress(source_img, quality, out_format) 
{
	
	let mime_type;
	
    switch (out_format) {
        case "jpeg":
            mime_type = "image/jpeg";
            break;
        case "webp":
            mime_type = "image/webp";
            break;
        case "png":
            mime_type = "image/png";
            break;
        case "jpg":
            mime_type = "image/jpg";
            break;
        default:
            alert("Error: reload the app ... ");
            break;
    }
		
	for(let h in source_img) {
	
		let c = document.createElement('canvas');
		c.height = source_img[h].height;		
		c.width = source_img[h].width;
		let helfer = new Image();
		helfer.src = source_img[h].src;
		helfer.onload = function() 
		{	
        let ctx = c.getContext('2d');
        ctx.drawImage(helfer, 0, 0);

		let newImageBlob = c.toBlob( ( blob ) => {

		writeData(blob, source_img[h].name.replace(/\.(jpg|png|webp|jpeg)$/, ''))
		}, mime_type, quality / 100);
		
		}
    }
}
	
	let writeDataDB = []
	
	let timer = 0;
 
	async function writeData(imgIn, n) 
	{
		
		writeDataDB.push (imgIn);
	
		try 
		{
			
		let mime_type;
	
    switch (imgIn.type) {
        case "image/jpeg":
            mime_type = ".jpeg";
            break;
        case "image/webp":
            mime_type = ".webp";
            break;
        case "image/png":
            mime_type = ".png";
            break;
        case "image/jpg":
            mime_type = ".jpg";
            break;
        default:
            alert("Error: reload the app ... ");
            break;
    }

	let fhandle = await pc_dir.getFileHandle(n + mime_type, {create: true})  
	let writable = await fhandle.createWritable()
	await writable.write(imgIn)
	await writable.close();
			
		}
		catch (e)
		{
			console.error("There was an error while write the files. Error msg: " + e);
		}
		
	}