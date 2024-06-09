//Blogkurs

// Startseite bei Installation
chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === 'install') {
	  chrome.tabs.create({
		url: 'about.html'
	});    
  }
});
// Seite beim Klick auf das Icon
chrome.action.onClicked.addListener((e) => {
	chrome.tabs.create({
			url: "index.html"
	});
});





