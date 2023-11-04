import { creazaPiesa, loading } from "./ui-elements.js"

$(document).ready(function () {
  let modEditor
  let idToSave = []
  let user
  let display = ""
  let disable = ""

  function removeAllEventListeners() {
    const body = document.body
    const bodyClone = body.cloneNode(true)
    body.parentNode.replaceChild(bodyClone, body)
  }

  //logica meniu principal
  $(".buton-admin, .buton-logare, .loading-logare").toggleClass("ascunde-meniu")
  $("#logare").click(function () {
    $.ajax({
      type: "GET",
      url: `/verifyAdmin`,
      contentType: "application/json",
      data: { password: $(".password").val() },
      success: function (response) {
        if (response) {
          $(".password-container").addClass("ascunde-meniu")
          user = "admin"
          start()
        } else {
          $(".password").css("background", "red")
        }
      },
      error: function (error) {
        console.log(error)
      },
    })
  })

  function scrollToElement(elementId) {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  $(".buton-admin").click(function () {
    $(".password-container").toggleClass("ascunde-meniu")
  })

  $(".inchide-logare").click(function () {
    $(".password-container").toggleClass("ascunde-meniu")
  })

  function start() {
    $(".meniu-logare,.meniu-principal").toggleClass("ascunde-meniu")
    if (user != "admin") {
      $("#add-button").attr("disabled", "true")
      display = `style="display:none"`
      disable = "disabled"
    }
    continuestart()
  }

  function continuestart(id) {
    $(".piese-cautate").html(loading())
    $.ajax({
      type: "GET",
      url: "/getDB",
      contentType: "application/json",
      success: function (data) {
        user == "admin"
          ? (modEditor = "contenteditable=true")
          : (modEditor = "")
        creazaListe(data)
        initializareElemente(id)
      },
      error: function (error) {
        console.log(error)
      },
    })
  }

  $(".buton-logare").click(function () {
    user == "guest"
    start()
  })

  let piese = []
  function creazaListe(data) {
    //golire piese ramase
    piese = []
    //creaza lista de piese
    for (let i = 0; i < data.length; i++) {
      piese[i] = creazaPiesa(i, data, display, modEditor, culoareStoc, disable)
    }
    //adauga lista de piese in pagina
    $(".piese-cautate").html([...piese])
    $(".nr_piese").html(`<strong>Rezultate</strong>:${data.length}`)
  }

  function culoareStoc(actual, admis) {
    return Number(actual) == Number(admis)
      ? "orange"
      : Number(actual) < Number(admis)
      ? "red"
      : "green"
  }

  let idRetragere
  let idStergere
  function salvareModificari() {
    let idToSaveFiltered = idToSave.filter(
      (element, index) => idToSave.indexOf(element) == index
    )

    var reperModificat = {
      poza_piesa: "",
      nume_reper: "",
      tip_reper: "",
      cod_ifs: "",
      producator: "",
      cod_producator: "",
      linie_productie: "",
      serie_echipament: "",
      locatie_magazie: "",
      hala: "",
      descriere: "",
      observatii: "",
      cantitate_stoc_actual: "",
      cantitate_stoc_minim: "",
      unitate_masura: "",
      pret_unitar_lei: "",
    }

    idToSaveFiltered.forEach((element) => {
      for (const prop in reperModificat) {
        if (prop == "poza_piesa") {
          reperModificat[prop] = $(`#${element}`).children().first().attr("src")
        } else {
          reperModificat[prop] = $(
            $(`#${element}`).find(".data")[
              Object.keys(reperModificat).indexOf(prop)
            ]
          )
            .text()
            .trim()
        }
      }
      $.ajax({
        type: "PUT",
        url: `/modifyDB/${element}`,
        contentType: "application/json",
        data: JSON.stringify(reperModificat),
        success: function () {
          console.log("Repere salvate")
        },
        error: function (error) {
          console.log(error)
        },
      })
    })
    continuestart(idRetragere)
  }

  $("#salvare").click(salvareModificari)

  //search
  $("#search-button").click(() => filtrare($("#search").val()))

  $("#search").on("keyup", function (e) {
    if ($(this).val() == "") {
      filtrare($("#search").val())
    }
    if (e.which == 13) {
      e.preventDefault()
      filtrare($("#search").val())
    }
  })

  //alegere optiuni filtrare
  let optiuni = ["", "", "", ""]
  $("#categorieSearch,#halaSearch,#producatorSearch,#tipreper").on(
    "change",
    function () {
      optiuni[$(".meniu-sortare").children().index($(this).parent()[0])] =
        $(this).val()
    }
  )

  function filtrare(val) {
    $(".piese-cautate").removeClass("ascunde-meniu")
    $(".formPost").addClass("ascunde-meniu")
    const parser = new DOMParser()
    $(".piese-cautate").html(loading())
    let lista = piese.filter((element) => {
      return (
        parser
          .parseFromString(element, "text/html")
          .body.textContent.toUpperCase()
          .includes(val.toUpperCase()) &&
        optiuni.every((option) =>
          parser
            .parseFromString(element, "text/html")
            .body.textContent.toUpperCase()
            .includes(option.toUpperCase())
        )
      )
    })
    $(".piese-cautate").html([...lista])
    $(".nr_piese").html(`<strong>Rezultate</strong>: ${lista.length}`)
    initializareElemente()
  }

  $("#add-button").click(function () {
    $(".piese-cautate").toggleClass("ascunde-meniu")
    $(".formPost").toggleClass("ascunde-meniu")

    $("form")
      .off("submit")
      .on("submit", function (e) {
        e.preventDefault()
        $(".piese-cautate").toggleClass("ascunde-meniu")
        $(".formPost").toggleClass("ascunde-meniu")

        var formData = new FormData()
        formData.append("json", JSON.stringify(reperNou))
        formData.append("file", $("#poza_piesa")[0].files[0])

        $.ajax({
          type: "POST",
          url: "/addDB",
          processData: false,
          contentType: false,
          data: formData,
          success: function (resp) {
            console.log(resp)
            continuestart()
          },
          error: function (error) {
            console.log(error)
          },
        })
      })

    $(
      "#poza_piesa, #nume_reper, #cod_ifs, #producator, #cod_producator,#linie_productie, #serie_echipament, #locatie_magazie, #descriere, #cantitate_stoc_minim, #cantitate_stoc_actual, #unitate_masura, #pret_unitar_lei, #hala, #tip_reper, #observatii"
    )
      .off("change")
      .on("change", function () {
        reperNou[$(this).attr("id")] = $(this).val() || $(this).text()
        if ($(this).attr("id") === "poza_piesa") {
          reperNou[$(this).attr("id")] =
            "./piese/" +
            $(this)
              .val()
              .slice($(this).val().lastIndexOf("\\") + 1)
        }
        console.log(reperNou)
      })
  })

  $("#delogare").click(() => {
    window.location.reload()
  })

  var reperNou = {
    poza_piesa: "",
    nume_reper: "",
    cod_ifs: "",
    producator: "",
    cod_producator: "",
    linie_productie: "",
    serie_echipament: "",
    locatie_magazie: "",
    descriere: "",
    cantitate_stoc_minim: "",
    cantitate_stoc_actual: "",
    unitate_masura: "",
    pret_unitar_lei: "",
    hala: "",
    tip_reper: "",
    observatii: "",
  }

  function successPost() {
    console.log("Adaugat cu succes")
  }

  function initializareElemente(id) {
    if (id) {
      console.log("scroll effect")
      scrollToElement(id)
    }
    $(
      ".buton-stergere,.sterge,.anulare,.inchide,.inchide-stergere,.poza-piesa,.inchide-zoom,.retrage,.piesa"
    ).unbind("click")

    //buton stergere inital la fiecare reper
    $(".buton-stergere").click(function () {
      $(".stergere-reper").toggleClass("flex")
      idStergere = $($(this).parent().parent().parent()).attr("id")
    })

    //buton stergere final/ comfirmare
    $(".sterge").click(function (e) {
      e.preventDefault()
      $.ajax({
        type: "DELETE",
        url: `/deleteDB/${idStergere}`,
        success: function (resp) {
          console.log(resp)
        },
        error: function (error) {
          console.log(error)
        },
      })
      $(".stergere-reper").toggleClass("flex")
      continuestart()
    })
    //anulare stergere
    $(".anulare").click(function () {
      $(".stergere-reper").toggleClass("flex")
    })

    //modificare stoc actual
    $(".buton-stoc").click(function () {
      $(".retragere-reper").toggleClass("flex")
      idRetragere = $($(this).parent().parent().parent()).attr("id")
    })

    $(".inchide").click(() => {
      $(".retragere-reper").toggleClass("flex")
    })

    $(".inchide-sterge").click(() => {
      $(".stergere-reper").toggleClass("flex")
    })

    $(".poza-piesa,.inchide-zoom").click(function () {
      $(".zoom-reper-container").toggleClass("ascunde-meniu")
      $(".zoom-reper").css("background-image", `url(${$(this).attr("src")})`)
    })

    $(".retrage").click(function () {
      //verfica valoarea sa fie cel putin egal cu stoc actual
      if (
        Number($($(`#${idRetragere}`).find(".valoare-actual")).text()) -
          Number($(".cantitateRetragere").val()) <
        0
      ) {
        alert(
          "Numarul de repere trebuie sa fie cel putin egal cu numarul minim admis!"
        )
      } else {
        //scade valoarea din stoc actual
        $($(`#${idRetragere}`).find(".valoare-actual")).text(
          Number($($(`#${idRetragere}`).find(".valoare-actual")).text()) -
            Number($(".cantitateRetragere").val())
        )
        $(".retragere-reper").toggleClass("flex")

        //schimbare culoare stoc
        $(`#${idRetragere}`)
          .find(".numar-stoc-actual")
          .css(
            "background",
            `${culoareStoc(
              Number($($(`#${idRetragere}`).find(".valoare-actual")).text()),
              Number($($(`#${idRetragere}`).find(".valoare-minim")).text())
            )}`
          )

        //salvare in html stoc
        let indexPiesa = piese.indexOf(
          piese.filter((element) => element.includes(idRetragere) == true)[0]
        )
        piese[indexPiesa] = $(`#${idRetragere}`).prop("outerHTML")
        salvareModificari()
      }
    })

    $(".piesa").click(function () {
      let indexPiesa = piese.indexOf(
        piese.filter(
          (element) => element.includes($(this).attr("id")) == true
        )[0]
      )
      piese[indexPiesa] = $(this).prop("outerHTML")
      idToSave.push($(this).attr("id"))
    })
  }
})
