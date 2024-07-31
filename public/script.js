let showMenu = () => {
    let MenuOption = document.getElementById("manuOpt");
    MenuOption.classList.toggle("hidden");
}


const searchInput = document.getElementById('searchInput');
const friendItems = document.querySelectorAll('.friend-item');

function showInputBox() {
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.getElementById('searchIcon');
    const cancelIcon = document.getElementById('cancelIcon');

    searchInput.classList.remove('hidden'); // Show input box
    searchIcon.classList.add('hidden'); // Hide search icon
    cancelIcon.classList.remove('hidden'); // Show cancel icon
}

function hideInputBox() {
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.getElementById('searchIcon');
    const cancelIcon = document.getElementById('cancelIcon');

    searchInput.value = ''; // Clear input value
    searchInput.classList.add('hidden'); // Hide input box
    searchIcon.classList.remove('hidden'); // Show search icon
    cancelIcon.classList.add('hidden'); // Hide cancel icon
}

searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase().trim();

    friendItems.forEach(item => {
        const friendName = item.querySelector('.friend-name').textContent.toLowerCase();

        if (friendName.includes(searchTerm)) {
            item.style.display = 'block'; // Show matching friends
        } else {
            item.style.display = 'none'; // Hide non-matching friends
        }
    });
});

let showRemoveFnd = (id) => {
    let deletebtn = document.getElementById("deletebtn_" + id);
    let cancelbtn = document.getElementById("cancelbtn_" + id);
    cancelbtn.classList.remove("hidden");
    deletebtn.classList.remove("hidden");
}
let cancel = (id) => {
    let cancelbtn = document.getElementById("cancelbtn_" + id);
    let deletebtn = document.getElementById("deletebtn_" + id);
    cancelbtn.classList.add("hidden");
    deletebtn.classList.add("hidden");
}

let showOpt = (optid) => {
    let opt = document.getElementById(optid)
    let ShowOption = document.getElementById("option_" + optid);
    ShowOption.classList.toggle("hidden");
}
function showComments(postId) {
    let commentBox = document.getElementById("commentBox_" + postId);
    // commentBox.classList.toggle("hidden");
    if (commentBox.style.display === "none") {
        commentBox.style.display = "block";
    } else {
        commentBox.style.display = "none";
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector("[data-collapse-toggle]");
    const menu = document.getElementById("navbar-user");

    toggleButton.addEventListener("click", function () {
        const expanded = toggleButton.getAttribute("aria-expanded") === "true" || false;
        toggleButton.setAttribute("aria-expanded", !expanded);
        menu.classList.toggle("hidden");
    });
});