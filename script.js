const navToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
}

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".faq-item").classList.toggle("open");
  });
});

const leadForm = document.querySelector("#leadForm");
const successBox = document.querySelector("#leadSuccess");
const exportButton = document.querySelector("#exportLeads");

function getLeads() {
  return JSON.parse(localStorage.getItem("hengrui_leads") || "[]");
}

function setLeads(leads) {
  localStorage.setItem("hengrui_leads", JSON.stringify(leads));
}

if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(leadForm).entries());
    data.createdAt = new Date().toLocaleString("zh-CN");
    const leads = getLeads();
    leads.unshift(data);
    setLeads(leads);
    leadForm.reset();
    if (successBox) successBox.style.display = "block";
    const subject = encodeURIComponent(`网站询价留言 - ${data.company || data.name || "客户"}`);
    const body = encodeURIComponent([
      `提交时间：${data.createdAt}`,
      `姓名：${data.name || ""}`,
      `公司：${data.company || ""}`,
      `电话/微信：${data.phone || ""}`,
      `邮箱：${data.email || ""}`,
      `需求类型：${data.service || ""}`,
      "",
      "项目说明：",
      data.message || ""
    ].join("\n"));
    window.location.href = `mailto:gdpp719@outlook.com?subject=${subject}&body=${body}`;
  });
}

if (exportButton) {
  exportButton.addEventListener("click", () => {
    const leads = getLeads();
    if (!leads.length) {
      alert("当前还没有留言线索。");
      return;
    }
    const headers = ["createdAt", "name", "company", "phone", "email", "service", "message"];
    const rows = [headers.join(",")].concat(leads.map((lead) =>
      headers.map((key) => `"${String(lead[key] || "").replaceAll('"', '""')}"`).join(",")
    ));
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "客户留言线索.csv";
    link.click();
    URL.revokeObjectURL(url);
  });
}
