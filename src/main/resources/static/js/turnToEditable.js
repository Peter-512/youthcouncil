import csrfHeader from "./csrfHeader.js";

const {name, value} = csrfHeader();
// Select DOM elements
const apHiddenInput = document.querySelector(".actionPointId");
const ycHiddenInput = document.querySelector(".youthCouncilId");
const editButton = document.querySelector(".edit");
const saveButton = document.querySelector(".save");
const label = document.querySelector("#label");
const labelInput = document.querySelector("#labelInput");

// Extract data from DOM elements
const actionPointId = +apHiddenInput.id.substring(apHiddenInput.id.indexOf("_") + 1);
const youthCouncilId = +ycHiddenInput.id.substring(ycHiddenInput.id.indexOf("_") + 1);
const municipality = window.location.pathname.split("/")[2];

// Initialize initial values array
const initialValues = document.querySelectorAll(".editable");
const initialValuesArray = Array.from(initialValues).map(tag => tag.textContent);

// Attach event listeners
editButton.addEventListener("click", turnTagsToEditable);
saveButton.addEventListener("click", turnEditableToTags);

// Convert tags to editable state
function turnTagsToEditable() {
	const editableTags = document.querySelectorAll(".editable");
	editableTags.forEach(tag => {
		tag.style.color = "gray";
		tag.style.fontStyle = "italic";
		tag.setAttribute("contenteditable", "true");
	});
	label.setAttribute("hidden", "hidden");
	labelInput.removeAttribute("hidden");
	// label.replaceWith();

}

// Convert editable tags back to normal tags
function turnEditableToTags() {
	processActionPointEdit();
	const editableTags = document.querySelectorAll(".editable");
	editableTags.forEach(tag => {
		tag.style.color = "black";
		tag.style.fontStyle = "normal";
		tag.setAttribute("contenteditable", "false");
	});

	label.removeAttribute("hidden");
	label.innerText = labelInput.value;
	labelInput.setAttribute("hidden", "hidden");
}

// Process the edited action point and send it to the server
function processActionPointEdit() {
	const editableTags = document.querySelectorAll(".editable");
	for (let i = 0; i < editableTags.length; i++) {
		if (editableTags[i].textContent !== initialValuesArray[i]
			|| labelInput.value !== label.innerText) {
			const actionPoint = {};
			actionPoint[label.id] = labelInput.value;
			editableTags.forEach(tag => {
				actionPoint[tag.id] = tag.textContent;
			});
			fetch(`/api/actionpoints/${youthCouncilId}/${actionPointId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					[name]: value
				},
				body: JSON.stringify(actionPoint)
			})
				.then((response) => {
					handleUpdateResponse(response);
				});
			break;
		}
	}
}

// Handle server response after editing action point
function handleUpdateResponse(response) {
	if (response.ok) {
		response.json()
			.then(async (json) => {
				const newID = json["id"];
				if (newID !== actionPointId) {
					window.location.replace(`http://localhost:8081/youthcouncils/${municipality}/actionpoints/${newID}`);
				}
			});
	} else {
		response.json()
			.then(async (json) => {
					const error = json["error"];
					console.log(error);
				}
			);
	}
}

//
// function turnTagsIntoInputs() {
// 	const editableTags = document.querySelectorAll(".editable");
// 	editableTags.forEach(tag => {
// 		const input = document.createElement("input");
// 		input.setAttribute("type", "text");
// 		input.setAttribute("value", tag.textContent);
// 		// Save the tag name and attributes before replacing it with the input field
// 		const tagName = tag.tagName.toLowerCase();
// 		const attributes = Array.from(tag.attributes).map(attr => `${attr.name}="${attr.value}"`).join(" ");
// 		input.setAttribute("data-tag-name", tagName);
// 		input.setAttribute("data-tag-attributes", attributes);
// 		tag.parentNode.replaceChild(input, tag);
// 	});
// }
//
// function turnInputsIntoTags() {
// 	const inputs = document.querySelectorAll("input[type=\"text\"]");
// 	inputs.forEach(input => {
// 		// Get the tag name and attributes from the data attributes
// 		const tagName = input.getAttribute("data-tag-name");
// 		const attributes = input.getAttribute("data-tag-attributes");
// 		const tag = document.createElement(tagName);
// 		tag.setAttribute("class", "editable");
// 		// Set the original attributes on the tag
// 		if (attributes) {
// 			tag.setAttribute("data-tag-attributes", attributes);
// 			attributes.split(" ").forEach(attr => {
// 				const [name, value] = attr.split("=");
// 				if (name && value) {
// 					tag.setAttribute(name, value.replace(/"/g, ""));
// 				}
// 			});
// 		}
// 		tag.textContent = input.value;
// 		input.parentNode.replaceChild(tag, input);
// 	});
// }