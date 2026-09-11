// MOCK DATA
let mockSheets = [
    {
        id: 1,
        title: "สรุปสูตรฟิสิกส์ ม.4",
        author: "User_A",
        grade: "ม.4",
        status: "pending"
    },

    {
        id: 2,
        title: "เคมีอินทรีย์พื้นฐาน",
        author: "User_B",
        grade: "ม.5",
        status: "pending"
    },

    {
        id: 3,
        title: "ชีววิทยา ระบบนิเวศ",
        author: "User_C",
        grade: "ม.6",
        status: "pending"
    },

    {
        id: 4,
        title: "คณิตศาสตร์ เรื่องฟังก์ชัน",
        author: "User_D",
        grade: "ม.4",
        status: "approved"
    }
];

// จำนวนผู้ใช้งานจำลอง
let totalUsers = 128;

// จำนวนรายงานปัญหาจำลอง
let totalReports = 5;

// ID ของรายการที่กำลังจะลบ
let deleteTargetId = null;

// active state sidebar
const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(function(item) {
    item.addEventListener("click", function() {
        navItems.forEach(function(el) {
            el.classList.remove("active");
        });
        item.classList.add("active");
    });
});

// ELEMENTS
const tableBody =
    document.getElementById("sheetTableBody");

const totalSheetsElement =
    document.getElementById("totalSheets");

const pendingSheetsElement =
    document.getElementById("pendingSheets");

const totalUsersElement =
    document.getElementById("totalUsers");

const totalReportsElement =
    document.getElementById("totalReports");

// Modal
const deleteModal =
    document.getElementById("deleteModal");

const confirmDeleteButton =
    document.getElementById("confirmDelete");

const cancelDeleteButton =
    document.getElementById("cancelDelete");

// Edit form
const editForm =
    document.getElementById("editForm");

const editId =
    document.getElementById("editId");

const editTitle =
    document.getElementById("editTitle");

const editAuthor =
    document.getElementById("editAuthor");

const editGrade =
    document.getElementById("editGrade");

const cancelEdit =
    document.getElementById("cancelEdit");

// RENDER TABLE
function renderTable() {

    tableBody.innerHTML = "";

    if (mockSheets.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    ไม่มีข้อมูลชีท
                </td>
            </tr>
        `;

        return;
    }


    mockSheets.forEach(function(sheet) {
        const row =
            document.createElement("tr");

        // ชื่อชีท
        const titleCell =
            document.createElement("td");

        titleCell.textContent =
            sheet.title;

        // ผู้จัดทำ
        const authorCell =
            document.createElement("td");

        authorCell.textContent =
            sheet.author;

        // ระดับชั้น
        const gradeCell =
            document.createElement("td");

        gradeCell.textContent =
            sheet.grade;


        // Status
        const statusCell =
            document.createElement("td");

        const status =
            document.createElement("span");

        status.classList.add("status");

        if (sheet.status === "pending") {

            status.classList.add(
                "status-pending"
            );

            status.textContent =
                "รออนุมัติ";

        } else {

            status.classList.add(
                "status-approved"
            );

            status.textContent =
                "อนุมัติแล้ว";
        }

        statusCell.appendChild(status);


        // Action
        const actionCell =
            document.createElement("td");


        // Approve button
        if (sheet.status === "pending") {

            const approveButton =
                document.createElement("button");

            approveButton.className =
                "btn btn-approve";

            approveButton.textContent =
                "Approve";

            approveButton.addEventListener(
                "click",
                function() {
                    approveSheet(sheet.id);
                }
            );

            actionCell.appendChild(
                approveButton
            );
        }

        // Edit button
        const editButton =
            document.createElement("button");

        editButton.className =
            "btn btn-edit";

        editButton.textContent =
            "Edit";

        editButton.addEventListener(
            "click",
            function() {
                editSheet(sheet.id);
            }
        );

        actionCell.appendChild(
            editButton
        );

        // Delete button
        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "btn btn-delete";

        deleteButton.textContent =
            "Delete";

        deleteButton.addEventListener(
            "click",
            function() {
                openDeleteModal(sheet.id);
            }
        );

        actionCell.appendChild(
            deleteButton
        );

        // Add cells to row
        row.appendChild(titleCell);
        row.appendChild(authorCell);
        row.appendChild(gradeCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        // Add row to table
        tableBody.appendChild(row);
    });
}
// APPROVE SHEET
function approveSheet(id) {
    const sheet =
        mockSheets.find(
            function(item) {
                return item.id === id;
            }
        );
    if (!sheet) {
        return;
    }
    sheet.status = "approved";
    alert(
        "อนุมัติชีท \"" +
        sheet.title +
        "\" เรียบร้อยแล้ว"
    );
    renderTable();
    updateDashboard();

}
// OPEN DELETE MODAL
function openDeleteModal(id) {
    deleteTargetId = id;
    deleteModal.classList.add("show");

}
// CANCEL DELETE
cancelDeleteButton.addEventListener(
    "click",
    function() {
        deleteTargetId = null;
        deleteModal.classList.remove("show");

    }
);
// CONFIRM DELETE
confirmDeleteButton.addEventListener(
    "click",
    function() {
        if (deleteTargetId === null) {
            return;
        }
        mockSheets =
            mockSheets.filter(
                function(sheet) {
                    return sheet.id !== deleteTargetId;
                }
            );
        deleteTargetId = null;
        deleteModal.classList.remove("show");

        renderTable();
        updateDashboard();
    }
);
// EDIT SHEET
function editSheet(id) {
    const sheet =
        mockSheets.find(
            function(item) {
                return item.id === id;
            }
        );
    if (!sheet) {
        return;
    }
    editId.value =
        sheet.id;

    editTitle.value =
        sheet.title;

    editAuthor.value =
        sheet.author;

    editGrade.value =
        sheet.grade;

    document
        .getElementById("editSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}
// UPDATE SHEET
editForm.addEventListener(
    "submit",
    function(event) {
        event.preventDefault();
        const id =
            Number(editId.value);
        const sheet =
            mockSheets.find(
                function(item) {
                    return item.id === id;
                }
            );

        if (!sheet) {
            return;
        }
        sheet.title =
            editTitle.value;
        sheet.author =
            editAuthor.value;
        sheet.grade =
            editGrade.value;
        alert(
            "แก้ไขข้อมูลเรียบร้อยแล้ว"
        );

        renderTable();m
        editForm.reset();
        editId.value = "";
    }
);
cancelEdit.addEventListener(
    "click",
    function() {

        editForm.reset();

        editId.value = "";

    }
);
function updateDashboard() {
    const totalSheets =
        mockSheets.length;

    const pendingSheets =
        mockSheets.filter(
            function(sheet) {
                return sheet.status === "pending";
            }
        ).length;
    totalSheetsElement.textContent =
        totalSheets;
    pendingSheetsElement.textContent =
        pendingSheets;
    totalUsersElement.textContent =
        totalUsers;
    totalReportsElement.textContent =
        totalReports;
}
renderTable();
updateDashboard();