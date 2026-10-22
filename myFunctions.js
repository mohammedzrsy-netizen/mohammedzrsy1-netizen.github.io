var DISCOUNT_MIN_DAYS = 7;
var DISCOUNT_RATE = 10;
var CAR_COUNT = 5;
var SITE_LINK = "http://www.alwiam-car-rental.sy";
var ARABIC_LETTERS = "ابتثجحخدذرزسشصضطظعغفقكلمنهويىءأإآؤئة";
var GOVERNORATE_CODES = "01|02|03|04|05|06|07|08|09|10|11|12|13|14";
var EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
var MOBILE_PATTERN = /^(09[3-9]\d{7}|9639[3-9]\d{7}|009639[3-9]\d{7})$/;
var DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
var noteCounter = 0;
var bookingCounter = 0;

function byId(id) {
  return document.getElementById(id);
}

function trimText(text) {
  var result = "" + text;
  result = result.replace(/^\s+/, "");
  result = result.replace(/\s+$/, "");
  return result;
}

function onlyDigits(text) {
  var result = "";
  var i;
  var ch;
  for (i = 0; i < text.length; i = i + 1) {
    ch = text.charAt(i);
    if (ch >= "0" && ch <= "9") {
      result = result + ch;
    }
  }
  return result;
}

function isArabicName(text) {
  if (text.length === 0) {
    return false;
  }
  var i;
  var ch;
  var letters = 0;
  for (i = 0; i < text.length; i = i + 1) {
    ch = text.charAt(i);
    if (ch !== " ") {
      if (ARABIC_LETTERS.indexOf(ch) === -1) {
        return false;
      }
      letters = letters + 1;
    }
  }
  return letters > 0;
}

function isValidEmail(text) {
  return text.search(EMAIL_PATTERN) !== -1;
}

function isValidMobile(text) {
  return text.search(MOBILE_PATTERN) !== -1;
}

function addCommas(number) {
  var digits = "" + number;
  var result = "";
  var count = 0;
  var i;
  for (i = digits.length - 1; i >= 0; i = i - 1) {
    result = digits.charAt(i) + result;
    count = count + 1;
    if (count === 3 && i > 0) {
      result = "," + result;
      count = 0;
    }
  }
  return result;
}

function isLeapYear(year) {
  if (year % 400 === 0) {
    return true;
  }
  if (year % 100 === 0) {
    return false;
  }
  return year % 4 === 0;
}

function daysInMonth(month, year) {
  if (month === 2) {
    if (isLeapYear(year)) {
      return 29;
    }
    return 28;
  }
  if (month === 4 || month === 6 || month === 9 || month === 11) {
    return 30;
  }
  return 31;
}

function readDate(text) {
  if (text.search(DATE_PATTERN) === -1) {
    return null;
  }
  var parts = text.split("-");
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var day = parseInt(parts[2], 10);
  if (month < 1 || month > 12) {
    return null;
  }
  if (day < 1 || day > daysInMonth(month, year)) {
    return null;
  }
  return new Date(year, month - 1, day);
}

function padNumber(value) {
  if (value < 10) {
    return "0" + value;
  }
  return "" + value;
}

function dateToText(dateValue) {
  var day = padNumber(dateValue.getDate());
  var month = padNumber(dateValue.getMonth() + 1);
  var year = dateValue.getFullYear();
  return year + "-" + month + "-" + day;
}

function countRentalDays(startDate, endDate) {
  var days = 0;
  var current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  while (current.getTime() < endDate.getTime()) {
    current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
    days = days + 1;
  }
  return days;
}

function discountAmount(total) {
  return parseInt(total * DISCOUNT_RATE / 100 + 0.5, 10);
}

function carCode(index) {
  return trimText(byId("code-" + index).innerHTML);
}

function carModel(index) {
  return trimText(byId("model-" + index).innerHTML);
}

function carPrice(index) {
  return parseInt(byId("price-" + index).innerHTML, 10);
}

function selectedIndices() {
  var result = [];
  var i;
  for (i = 0; i < CAR_COUNT; i = i + 1) {
    if (byId("sel-" + i).checked) {
      result[result.length] = i;
    }
  }
  return result;
}

function updateSelectionText() {
  var indices = selectedIndices();
  var text = "";
  var i;
  if (indices.length === 0) {
    byId("selectionText").innerHTML = "لم يتم اختيار أي سيارة بعد.";
    return;
  }
  for (i = 0; i < indices.length; i = i + 1) {
    if (i > 0) {
      text = text + " ، ";
    }
    text = text + carModel(indices[i]) + " (" + carCode(indices[i]) + ")";
  }
  byId("selectionText").innerHTML = "السيارات المختارة: " + text;
}

function showDetailsRow(index) {
  $("#details-" + index).slideDown(300);
  byId("dt-" + index).checked = true;
}

function hideDetailsRow(index) {
  $("#details-" + index).slideUp(300);
  byId("dt-" + index).checked = false;
}

function toggleDetailsRow(index) {
  if (byId("dt-" + index).checked) {
    showDetailsRow(index);
  } else {
    hideDetailsRow(index);
  }
}

function allDetailsShown() {
  var i;
  for (i = 0; i < CAR_COUNT; i = i + 1) {
    if (!byId("dt-" + i).checked) {
      return false;
    }
  }
  return true;
}

function showAllDetails() {
  var i;
  for (i = 0; i < CAR_COUNT; i = i + 1) {
    showDetailsRow(i);
  }
  byId("showAllDetailsButton").value = "إخفاء تفاصيل كل السيارات";
}

function hideAllDetails() {
  var i;
  for (i = 0; i < CAR_COUNT; i = i + 1) {
    hideDetailsRow(i);
  }
  byId("showAllDetailsButton").value = "إظهار تفاصيل كل السيارات";
}

function toggleAllDetails() {
  if (allDetailsShown()) {
    hideAllDetails();
  } else {
    showAllDetails();
  }
}

function filterCars() {
  var text = trimText(byId("carFilter").value).toLowerCase();
  var visible = 0;
  var i;
  var code;
  var model;
  for (i = 0; i < CAR_COUNT; i = i + 1) {
    code = carCode(i).toLowerCase();
    model = carModel(i).toLowerCase();
    if (text === "" || code.indexOf(text) !== -1 || model.indexOf(text) !== -1) {
      $("#row-" + i).show();
      visible = visible + 1;
    } else {
      $("#row-" + i).hide();
      hideDetailsRow(i);
    }
  }
  byId("filterResult").innerHTML = "عدد السيارات الظاهرة: " + visible;
}

function clearErrors() {
  byId("msgFullName").innerHTML = "";
  byId("msgNationalId").innerHTML = "";
  byId("msgMobile").innerHTML = "";
  byId("msgEmail").innerHTML = "";
  byId("msgStartDate").innerHTML = "";
  byId("msgEndDate").innerHTML = "";
  byId("msgBranch").innerHTML = "";
  byId("generalMessage").innerHTML = "";
}

function validateFullName() {
  var value = trimText(byId("fullName").value);
  if (value.length === 0) {
    byId("msgFullName").innerHTML = "يرجى إدخال الاسم الكامل.";
    return false;
  }
  if (!isArabicName(value)) {
    byId("msgFullName").innerHTML = "الاسم يجب أن يكون بالأحرف العربية فقط.";
    return false;
  }
  byId("msgFullName").innerHTML = "";
  return true;
}

function validateNationalId() {
  var value = trimText(byId("nationalId").value);
  var digits = onlyDigits(value);
  if (value.length === 0) {
    byId("msgNationalId").innerHTML = "الرقم الوطني إلزامي الإدخال.";
    return false;
  }
  if (digits.length !== 11 || digits.length !== value.length) {
    byId("msgNationalId").innerHTML = "الرقم الوطني يجب أن يتكون من 11 خانة رقمية.";
    return false;
  }
  if (GOVERNORATE_CODES.indexOf(digits.substring(0, 2)) === -1) {
    byId("msgNationalId").innerHTML = "أول خانتين يجب أن ترمزا إلى محافظة من 01 إلى 14.";
    return false;
  }
  byId("msgNationalId").innerHTML = "";
  return true;
}

function validateMobile() {
  var value = trimText(byId("mobile").value);
  if (value.length === 0) {
    byId("msgMobile").innerHTML = "";
    return true;
  }
  if (!isValidMobile(onlyDigits(value))) {
    byId("msgMobile").innerHTML = "رقم الموبايل يجب أن يطابق شبكتي سيريتل و MTN مثل 0933223344.";
    return false;
  }
  byId("msgMobile").innerHTML = "";
  return true;
}

function validateEmail() {
  var value = trimText(byId("email").value);
  if (value.length === 0) {
    byId("msgEmail").innerHTML = "";
    return true;
  }
  if (!isValidEmail(value)) {
    byId("msgEmail").innerHTML = "صيغة البريد الإلكتروني غير صحيحة.";
    return false;
  }
  byId("msgEmail").innerHTML = "";
  return true;
}

function validateStartDate() {
  var value = trimText(byId("startDate").value);
  if (value.length === 0) {
    byId("msgStartDate").innerHTML = "تاريخ بداية التأجير إلزامي الإدخال.";
    return false;
  }
  if (readDate(value) === null) {
    byId("msgStartDate").innerHTML = "أدخل التاريخ بصيغة yyyy-mm-dd مثل 2026-11-05.";
    return false;
  }
  byId("msgStartDate").innerHTML = "";
  return true;
}

function validateEndDate() {
  var value = trimText(byId("endDate").value);
  if (value.length === 0) {
    byId("msgEndDate").innerHTML = "تاريخ نهاية التأجير إلزامي الإدخال.";
    return false;
  }
  var end = readDate(value);
  if (end === null) {
    byId("msgEndDate").innerHTML = "أدخل التاريخ بصيغة yyyy-mm-dd مثل 2026-11-19.";
    return false;
  }
  var start = readDate(trimText(byId("startDate").value));
  if (start !== null && end.getTime() <= start.getTime()) {
    byId("msgEndDate").innerHTML = "تاريخ النهاية يجب أن يكون لاحقاً لتاريخ البداية.";
    return false;
  }
  byId("msgEndDate").innerHTML = "";
  return true;
}

function validateBranch() {
  var value = byId("branch").value;
  if (value === "") {
    byId("msgBranch").innerHTML = "يرجى اختيار فرع الاستلام.";
    return false;
  }
  byId("msgBranch").innerHTML = "";
  return true;
}

function validateRentalForm() {
  var errors = [];
  clearErrors();
  if (!validateFullName()) {
    errors[errors.length] = "الاسم الكامل";
  }
  if (!validateNationalId()) {
    errors[errors.length] = "الرقم الوطني";
  }
  if (!validateMobile()) {
    errors[errors.length] = "رقم الموبايل";
  }
  if (!validateEmail()) {
    errors[errors.length] = "البريد الإلكتروني";
  }
  if (!validateStartDate()) {
    errors[errors.length] = "تاريخ البداية";
  }
  if (!validateEndDate()) {
    errors[errors.length] = "تاريخ النهاية";
  }
  if (!validateBranch()) {
    errors[errors.length] = "فرع الاستلام";
  }
  if (errors.length > 0) {
    byId("generalMessage").innerHTML = "تحقق من الحقول التالية: " + errors.join(" ، ");
    return false;
  }
  return true;
}

function buildResultRows(indices, days) {
  var html = "<table><caption>تفاصيل المبلغ المستحق على الحجز</caption>" +
    "<tr><th>الرمز</th><th>الموديل</th><th>عدد الأيام</th><th>السعر اليومي</th>" +
    "<th>مجموع السيارة</th></tr>";
  var i;
  var price;
  var total;
  for (i = 0; i < indices.length; i = i + 1) {
    price = carPrice(indices[i]);
    total = days * price;
    html = html + "<tr><td>" + carCode(indices[i]) + "</td><td>" + carModel(indices[i]) +
      "</td><td>" + days + "</td><td>" + addCommas(price) + " ل.س</td><td>" +
      addCommas(total) + " ل.س</td></tr>";
  }
  html = html + "</table>";
  return html;
}

function showRentalResult() {
  var indices = selectedIndices();
  var start = readDate(trimText(byId("startDate").value));
  var end = readDate(trimText(byId("endDate").value));
  var days = countRentalDays(start, end);
  var i;
  var grandTotal = 0;
  var discount = 0;
  var finalTotal = 0;
  for (i = 0; i < indices.length; i = i + 1) {
    grandTotal = grandTotal + days * carPrice(indices[i]);
  }
  $("#resultCars").html(buildResultRows(indices, days));
  if (days > DISCOUNT_MIN_DAYS) {
    discount = discountAmount(grandTotal);
  }
  finalTotal = grandTotal - discount;
  byId("resultClient").innerHTML = trimText(byId("fullName").value);
  byId("resultPeriod").innerHTML = dateToText(start) + " حتى " + dateToText(end);
  byId("resultDays").innerHTML = days + " يوم";
  byId("resultTotal").innerHTML = addCommas(grandTotal) + " ل.س";
  byId("resultDiscount").innerHTML = addCommas(discount) + " ل.س";
  byId("resultFinal").innerHTML = addCommas(finalTotal) + " ل.س";
  if (days > DISCOUNT_MIN_DAYS) {
    byId("discountNotice").innerHTML = "تم تطبيق خصم " + DISCOUNT_RATE + "% لأن مدة التأجير تجاوزت " +
      DISCOUNT_MIN_DAYS + " أيام.";
    $("#discountRow").show();
  } else {
    byId("discountNotice").innerHTML = "لم يُطبَّق الخصم لأن مدة التأجير " + days +
      " أيام، والخصم يبدأ بعد " + DISCOUNT_MIN_DAYS + " أيام.";
    $("#discountRow").hide();
  }
  $("#resultBox").slideDown(400);
  window.alert("تم إرسال طلب الحجز بنجاح\nمقدم الطلب: " + trimText(byId("fullName").value) +
    "\nعدد السيارات: " + indices.length + "\nعدد أيام التأجير: " + days +
    "\nالمبلغ الإجمالي قبل الخصم: " + addCommas(grandTotal) + " ل.س" +
    "\nقيمة الخصم: " + addCommas(discount) + " ل.س" +
    "\nالمبلغ الإجمالي بعد الخصم: " + addCommas(finalTotal) + " ل.س");
}

function showBookingForm() {
  if (selectedIndices().length === 0) {
    $("#selectionAlert").slideDown(200);
    return;
  }
  $("#selectionAlert").slideUp(200);
  $("#bookingBox").slideDown(400);
  byId("fullName").focus();
}

function hideBookingForm() {
  $("#bookingBox").slideUp(400);
}

function showIdInfo() {
  var digits = onlyDigits(trimText(byId("nationalId").value));
  if (digits.length >= 2) {
    byId("idParity").innerHTML = "رمز المحافظة: " + digits.substring(0, 2);
  } else {
    byId("idParity").innerHTML = "";
  }
}

function addBookingRow() {
  var name = trimText(byId("bookingName").value);
  var cars = trimText(byId("bookingCars").value);
  var days = trimText(byId("bookingDays").value);
  var amount = trimText(byId("bookingAmount").value);
  if (name === "" || cars === "" || days === "" || amount === "") {
    byId("bookingStatus").innerHTML = "يرجى إكمال جميع حقول الحجز قبل الإضافة.";
    return;
  }
  if (byId("bookingEmptyRow") !== null) {
    $("#bookingEmptyRow").remove();
  }
  bookingCounter = bookingCounter + 1;
  var html = "<tr><td>BK-" + bookingCounter + "</td><td>" + dateToText(new Date()) +
    "</td><td>" + name + "</td><td>" + cars + "</td><td>" + days + "</td><td>" +
    amount + " ل.س</td></tr>";
  $("#bookingTable").append(html);
  $("#bookingTable tr").removeClass("row-alt");
  var rows = byId("bookingTable").getElementsByTagName("tr");
  var i;
  for (i = 1; i < rows.length; i = i + 1) {
    if (i % 2 === 0) {
      $(rows[i]).addClass("row-alt");
    }
  }
  byId("bookingName").value = "";
  byId("bookingCars").value = "";
  byId("bookingDays").value = "";
  byId("bookingAmount").value = "";
  byId("bookingStatus").innerHTML = "تمت إضافة الحجز إلى الجدول.";
}

function clearBookingTable() {
  var rows = byId("bookingTable").getElementsByTagName("tr");
  var i;
  for (i = rows.length - 1; i >= 1; i = i - 1) {
    $(rows[i]).remove();
  }
  $("#bookingTable").append("<tr id=\"bookingEmptyRow\"><td colspan=\"6\" class=\"empty-state\">لا توجد حجوزات مسجّلة حتى الآن.</td></tr>");
  bookingCounter = 0;
  byId("bookingStatus").innerHTML = "";
}

function addNote() {
  var text = trimText(byId("noteInput").value);
  if (text === "") {
    byId("notesEmpty").innerHTML = "اكتب نص الملاحظة قبل الإضافة.";
    return;
  }
  var id = "note-" + noteCounter;
  noteCounter = noteCounter + 1;
  var html = "<li id=\"" + id + "\">" + text + " <a href=\"#\" class=\"remove-note\">حذف</a></li>";
  $("#notesList").append(html);
  $("#" + id).hide();
  $("#" + id).fadeIn(400);
  $("#" + id + " a").click(function (event) {
    event.preventDefault();
    $("#" + id).slideUp(300);
    setTimeout(function () {
      $("#" + id).remove();
      if (byId("notesList").getElementsByTagName("li").length === 0) {
        byId("notesEmpty").innerHTML = "لا توجد ملاحظات حتى الآن.";
      }
    }, 320);
  });
  byId("noteInput").value = "";
  byId("notesEmpty").innerHTML = "";
}

function copySiteLink() {
  byId("siteLink").value = SITE_LINK;
  byId("siteLink").focus();
  byId("siteLink").select();
  byId("linkStatus").innerHTML = "الرابط محدد، اضغط Ctrl+C لنسخه.";
  $("#linkStatus").hide();
  $("#linkStatus").fadeIn(400);
}

function showCurrentYear() {
  byId("currentYear").innerHTML = new Date().getFullYear();
}

function prepareCarsPage() {
  var i;
  for (i = 0; i < CAR_COUNT; i = i + 1) {
    byId("dt-" + i).checked = false;
    byId("sel-" + i).checked = false;
    $("#details-" + i).hide();
  }
  $("#bookingBox").hide();
  $("#selectionAlert").hide();
  $("#resultBox").hide();
  $("#discountRow").hide();
  $("#carsTable tr.car-row:even").addClass("row-alt");
  updateSelectionText();
}

function bindCarsEvents() {
  var i;
  for (i = 0; i < CAR_COUNT; i = i + 1) {
    $("#dt-" + i).click(function () {
      toggleDetailsRow(parseInt($(this).attr("value"), 10));
    });
    $("#sel-" + i).click(function () {
      updateSelectionText();
    });
  }
  $("#showAllDetailsButton").click(toggleAllDetails);
  $("#clearSelectionButton").click(function () {
    var j;
    for (j = 0; j < CAR_COUNT; j = j + 1) {
      byId("sel-" + j).checked = false;
    }
    updateSelectionText();
  });
  $("#continueButton").click(showBookingForm);
  $("#hideBookingButton").click(hideBookingForm);
  $("#carFilter").keyup(filterCars);
  $("#carFilter").change(filterCars);
  $("#nationalId").blur(showIdInfo);
  $("#fullName").blur(validateFullName);
  $("#mobile").blur(validateMobile);
  $("#email").blur(validateEmail);
  $("#startDate").blur(validateStartDate);
  $("#endDate").blur(validateEndDate);
  $("#rentalForm").submit(function (event) {
    event.preventDefault();
    if (validateRentalForm()) {
      showRentalResult();
    }
  });
  $("#carsTable tr.car-row").hover(function () {
    $(this).addClass("row-hover");
  }, function () {
    $(this).removeClass("row-hover");
  });
}

function bindHomeEvents() {
  $("#addNoteButton").click(addNote);
  $("#copyLinkButton").click(copySiteLink);
  $("#addBookingButton").click(addBookingRow);
  $("#clearBookingsButton").click(clearBookingTable);
}

$(document).ready(function () {
  $(".main-nav a").hover(function () {
    $(this).addClass("nav-hover");
  }, function () {
    $(this).removeClass("nav-hover");
  });
  showCurrentYear();
  if (byId("carsTable") !== null) {
    prepareCarsPage();
    bindCarsEvents();
    filterCars();
  }
  if (byId("bookingTable") !== null) {
    bindHomeEvents();
  }
  if (byId("branchTable") !== null) {
    var rows = byId("branchTable").getElementsByTagName("tr");
    var k;
    for (k = 1; k < rows.length; k = k + 1) {
      if (k % 2 === 0) {
        $(rows[k]).addClass("row-alt");
      }
    }
  }
});
