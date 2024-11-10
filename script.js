import { TEXT_NODES } from "./src/js/TextNodes.js";
import { dictionary } from "./src/js/dictionary.js";

let LANGUAGE = navigator.languages.includes('ru-UA') ? 'ua' : 'en';
const BREAKPOINT = window.matchMedia("(min-width: 768px)");
let isLargeViewport = BREAKPOINT.matches;

function main() {
	const path = document.location.pathname.split("/").pop();
	const page = path.slice(0, path.length - 5).toLowerCase();
	initResponsiveBehaviour();
	initLanguage(page);
	initLocaleText(page);
	initNavTrigger();
	if (page === "index") linkArticles();
}

function initResponsiveBehaviour() {
	if (isLargeViewport) handlePositionedContent(true);

	BREAKPOINT.addEventListener("change", () => {
		const updViewport = BREAKPOINT.matches;
		if (updViewport === isLargeViewport) return

		handlePositionedContent(updViewport);
		isLargeViewport = updViewport;
	});
}

function handlePositionedContent(isLarge) {
	const body = document.body;
	const header = document.querySelector("header");
	const profile = document.querySelector(".profile");
	const navigation = document.querySelector(".navbar");
	const lastNeighbourNode = document.querySelector(".profile__btns");

	if (isLarge) {
		profile.removeChild(navigation);
		header.appendChild(navigation);
		header.removeChild(profile);
		body.insertBefore(profile, header);
	} else {
		body.removeChild(profile);
		header.appendChild(profile);
		header.removeChild(navigation);
		profile.insertBefore(navigation, lastNeighbourNode);
	}
}

function initLanguage(page) {
	const trigger = document.createElement("img");
	if (page === "index") {
		trigger.src = LANGUAGE === "en" ? "public/icons/UK.svg" : "public/icons/UA.svg";
	} else {
		trigger.src = LANGUAGE === "en" ? "../../public/icons/UK.svg" : "../../public/icons/UA.svg";
	}

	trigger.classList.add("language");
	trigger.addEventListener("click", () => {
		if (LANGUAGE === "en") {
			LANGUAGE = "ua";
			trigger.src = page === "index" ? "public/icons/UA.svg" : "../../public/icons/UA.svg";
		} else {
			LANGUAGE = "en";
			trigger.src = page === "index" ? "public/icons/UK.svg" : "../../public/icons/UK.svg";
		}
		initLocaleText(page);
	});
	document.querySelector("header").appendChild(trigger);
}

function initLocaleText(page) {
	// translate static content
	for (const key in TEXT_NODES.common) {
		if (Object.hasOwnProperty.call(TEXT_NODES.common, key)) {
			const element = TEXT_NODES.common[key];
			element.textContent = dictionary[key][LANGUAGE];
		}
	}
	// translate page content


	for (const key in TEXT_NODES[page]) {
		insertText(key, page);
	}

	if (page === "index") {
		for (const key in TEXT_NODES.articles) {
			insertText(key, "articles");
		}
	}

	function insertText(key, page) {
		try {
			if (!Object.hasOwnProperty.call(TEXT_NODES[page], key)) return;
			// check if element is not a collection
			if (typeof TEXT_NODES[page][key]?.item !== "function") {
				// insert html in text container
				if (TEXT_NODES[page][key].classList.contains("article__text")) {
					TEXT_NODES[page][key].innerHTML = "";
					TEXT_NODES[page][key].insertAdjacentHTML('afterbegin', dictionary[key][LANGUAGE]);
				} else {
					// insert plain text
					TEXT_NODES[page][key].textContent = dictionary[key][LANGUAGE];
				}
			} else {
				// element is a collection
				Array.from(TEXT_NODES[page][key]).forEach(node => {
					// articles topics
					if (node.hasAttribute("data-topic")) {
						node.textContent = dictionary[node.attributes["data-topic"].value][LANGUAGE];
					} else {
						// projects captions
						node.innerHTML = "";
						node.insertAdjacentHTML('afterbegin', dictionary[key][LANGUAGE]);
					}
				});
			}
		} catch (error) {
			console.error(error);
		}
	}
}

function initNavTrigger() {
	const navTrigger = document.getElementById("nav-trigger");
	const profile = document.querySelector(".profile");
	const header = document.querySelector("header");

	navTrigger.addEventListener("click", () => {
		const trigger = navTrigger;
		const parent = navTrigger.parentNode;
		profile.classList.toggle("in-viewport");

		navTrigger.parentElement.removeChild(navTrigger);

		if (parent.nodeName === "DIV") {
			header.appendChild(trigger);
		} else {
			profile.appendChild(trigger);
		}
	});
}

function linkArticles() {
	document.querySelectorAll(".article").forEach(article => {
		article.addEventListener("click", event => {
			window.location.href = "public/pages/Articles.html#" + event.target.id;
			window.location.href = "public/pages/Articles.html#" + event.target.id;
		});
	});
}

main();