$(document).ready(() => {
  getDiaries();
  bsCustomFileInput.init();
  const myTooltip = $('.tt')
  const tooltip = new bootstrap.Tooltip(myTooltip)
});
const diary = $("#input-diary-img")
const profile = $("#input-profile-img")
new bootstrap.Tooltip(diary)
new bootstrap.Tooltip(profile)

function postDiary() {

  const title = $('#title').val();
  const description = $('#description').val();
  let diaryImg = diary.prop("files")[0];
  let profileImg = profile.prop("files")[0];
  const btnSave = $('#btn-save');
  const btnLoad = $('#btn-loading');
  const form = document.forms['diary-form'];
  const successAlert = $('#alert-success');

  if (!title) {
    return alert("Please input your diary title");
  }

  if (!description) {
    return alert("Please input your diary description");
  }

  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("diaryImg", diaryImg);
  formData.append("profileImg", profileImg);

  btnSave.hide();
  btnLoad.show();
  $.ajax({
    type: "POST",
    url: "/diary",
    data: formData,
    contentType: false,
    processData: false,
    success: (response) => {
      btnSave.show();
      btnLoad.hide();
      successAlert.html(`
          <strong>Thanks!</strong> ${response.msg}.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `)
      successAlert.show();
      console.log(response.msg);
      form.reset();
      getDiaries();
    }
  })
}

function getDiaries() {

  const diariesBox = $('#diaries');

  $.ajax({
    type: "GET",
    url: "/diary",
    data: {},
    success: (response) => {
      diariesBox.empty();
      const diaries = response.diaries;
      if (!diaries.length) {
        diariesBox.html("<p>No diary, go outside!");
      } else {
        diaries.forEach(diary => {
          const temp_html = `
          <div class="col-lg-4 col-md-6 col-sm-12">
          <div class="card mb-3">
            <img
              src="static/img/diary/${diary.diaryImg || "default.jpg"}"
              class="card-img-top" alt="${diary.title}">
            <div class="card-body">
            <img src="static/img/profile/${diary.profileImg || 'default.jpg'}" class="rounded-circle mb-3" alt="My Profile Picture" id="profile-img"/>
              <h5 class="card-title">${diary.title}</h5>
              <p class="card-text">${diary.description}.</p>
              <p class="card-text"><small class="text-body-secondary">${diary.time} || ??-??-????</small></p>
            </div>
          </div>
        </div>
        `

          diariesBox.append(temp_html);
        });
      }
    }
  })
}