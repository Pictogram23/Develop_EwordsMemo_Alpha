'use strict';

var $ = require('jquery');
var PIXI = require('pixi.js');

document.addEventListener('DOMContentLoaded', function () {
  $(function () {
    const questions = [];
    let qNumber = -1;
    let point = 0,
      localValue = 1;
    let flag = false;
    let word, exampleFirst, exampleLast, exampleJapanese, getArray, decodeArray;
    let hiddenSwitch = false;
    let gameMode = 0;
    let rflag = false;
    let j = 1;
    let flagShift = false;

    const pixiApp = new PIXI.Application({
      width: 300,
      height: 158,
      backgroundAlpha: 0,
    });
    const el = document.getElementById('keyboard-panel');
    el.appendChild(pixiApp.view);

    const KeyboardExterior = new PIXI.Graphics().beginFill(0xcecece).drawRoundedRect(0, 0, 300, 158, 10).endFill();
    pixiApp.stage.addChild(KeyboardExterior);

    const keyboardTipsList = [
      { path: 'keyboard_tips/q', funcId: 0, char: 'q' }, // 0
      { path: 'keyboard_tips/w', funcId: 0, char: 'w' },
      { path: 'keyboard_tips/e', funcId: 0, char: 'e' },
      { path: 'keyboard_tips/r', funcId: 0, char: 'r' },
      { path: 'keyboard_tips/t', funcId: 0, char: 't' },
      { path: 'keyboard_tips/y', funcId: 0, char: 'y' },
      { path: 'keyboard_tips/u', funcId: 0, char: 'u' },
      { path: 'keyboard_tips/i', funcId: 0, char: 'i' },
      { path: 'keyboard_tips/o', funcId: 0, char: 'o' },
      { path: 'keyboard_tips/p', funcId: 0, char: 'p' },
      { path: 'keyboard_tips/a', funcId: 0, char: 'a' }, // 10
      { path: 'keyboard_tips/s', funcId: 0, char: 's' },
      { path: 'keyboard_tips/d', funcId: 0, char: 'd' },
      { path: 'keyboard_tips/f', funcId: 0, char: 'f' },
      { path: 'keyboard_tips/g', funcId: 0, char: 'g' },
      { path: 'keyboard_tips/h', funcId: 0, char: 'h' },
      { path: 'keyboard_tips/j', funcId: 0, char: 'j' },
      { path: 'keyboard_tips/k', funcId: 0, char: 'k' },
      { path: 'keyboard_tips/l', funcId: 0, char: 'l' },
      { path: 'keyboard_tips/backspace', funcId: 1 },
      { path: 'keyboard_tips/shift_off', funcId: 3 }, // 20
      { path: 'keyboard_tips/z', funcId: 0, char: 'z' },
      { path: 'keyboard_tips/x', funcId: 0, char: 'x' },
      { path: 'keyboard_tips/c', funcId: 0, char: 'c' },
      { path: 'keyboard_tips/v', funcId: 0, char: 'v' },
      { path: 'keyboard_tips/b', funcId: 0, char: 'b' },
      { path: 'keyboard_tips/n', funcId: 0, char: 'n' },
      { path: 'keyboard_tips/m', funcId: 0, char: 'm' },
      { path: 'keyboard_tips/enter', funcId: 2 },
      { path: 'keyboard_tips/apostrophe', funcId: 0, char: "'" },
      { path: 'keyboard_tips/hyphen', funcId: 0, char: '-' }, // 30
      { path: 'keyboard_tips/comma', funcId: 0, char: ',' },
      { path: 'keyboard_tips/period', funcId: 0, char: '.' },
      { path: 'keyboard_tips/question', funcId: 0, char: '?' },
      { path: 'keyboard_tips/exclamation', funcId: 0, char: '!' },
      { path: 'keyboard_tips/space', funcId: 0, char: ' ' },
      { path: 'keyboard_tips/shift_on' }, // 36
    ];

    let keyboardTips = [];
    let keyboardTipsSheet;

    const loader = new PIXI.Loader().add('keyboard_tips.json').load(function () {
      keyboardTipsSheet = loader.resources['keyboard_tips.json'];

      let keyboardTipsID = 0;
      let keyboardTipsColumns = 10;

      for (let i = 0; i < 4; i++) {
        if (i == 2) {
          keyboardTipsColumns = 9;
        } else if (i == 3) {
          keyboardTipsColumns = 7;
        }
        for (let j = 0; j < keyboardTipsColumns; j++) {
          let keyboardTip = new PIXI.Sprite(keyboardTipsSheet.textures[keyboardTipsList[keyboardTipsID].path]);

          const onKeyboardTipPointerUp = () => {
            keyboardTip.alpha = 1;
          };

          if (i < 3) {
            keyboardTip.position.set(6 + j * 29, 6 + i * 37);
          } else {
            keyboardTip.position.set(35 + j * 29, 6 + i * 37);
          }
          keyboardTip.interactive = true;
          keyboardTip.buttonMode = true;
          keyboardTip
            .on('pointerdown', function () {
              keyboardTip.alpha = 0.5;
              switch (keyboardTipsList[keyboardTips.findIndex((item) => item === this)].funcId) {
                case 0:
                  if (flagShift) {
                    if (
                      keyboardTipsList[keyboardTips.findIndex((item) => item === this)].char.match(/[a-z]/gi) !== null
                    ) {
                      keyboardInputChar(
                        keyboardTipsList[keyboardTips.findIndex((item) => item === this)].char.toUpperCase()
                      );
                    } else {
                      keyboardInputChar(keyboardTipsList[keyboardTips.findIndex((item) => item === this)].char);
                    }
                  } else {
                    keyboardInputChar(keyboardTipsList[keyboardTips.findIndex((item) => item === this)].char);
                  }
                  break;
                case 1:
                  keyboardBackSpace();
                  break;
                case 2:
                  keyboardCheckAnswer();
                  break;
                default:
                  break;
              }
            })
            .on('pointerup', onKeyboardTipPointerUp)
            .on('pointerup', function () {
              if (keyboardTipsList[keyboardTips.findIndex((item) => item === this)].funcId == 3) {
                if (flagShift) {
                  keyboardShiftOff();
                } else {
                  keyboardShiftOn();
                }
              }
            });

          window.addEventListener('pointerup', onKeyboardTipPointerUp);

          pixiApp.stage.addChild(keyboardTip);
          keyboardTips.push(keyboardTip);
          keyboardTipsID++;
        }
      }
    });

    showAddedWords();

    $('#answer').click(function () {
      keyboardShiftOff();
      $('#keyboard-modal').fadeIn();
      $('#keyboard-panel').fadeIn();
    });

    $('#button-goset').click(function () {
      $('#comment-qnone').css('display', 'none');
      $('#select-panel').css('display', 'none');
      $('#setting-panel').css('display', 'block');
      $('#list-word').css('display', 'block');
      $('#button-back').css('display', 'block');
      $('#button-go-backup').css('display', 'block');
      $('#comment-sorry').css('display', 'none');
      $('#comment-list-word').css('display', 'block');
      $('#button-all-delete').css('display', 'block');
    });

    $('#button-execute').click(function () {
      flag = false;
      let inputedSentence = escapeHTML($('#word').val());
      let decodedSentence = [];
      decodedSentence = inputedSentence.split('//');
      if (decodedSentence.length > 2) {
        document.getElementById('inputed-is-wrong').style.display = 'none';
        exampleFirst = decodedSentence[0];
        word = decodedSentence[1];
        exampleLast = decodedSentence[2];
        exampleJapanese = escapeHTML($('#example-japanese').val());
        while (flag === false) {
          if (localStorage.getItem(String(localValue)) !== null) {
            localValue++;
          } else {
            flag = true;
            localStorage.setItem(
              String(localValue),
              word + '^^^' + exampleFirst + '^^^' + exampleLast + '^^^' + exampleJapanese
            );
            $('#word').val('');
            $('#example-japanese').val('');
          }
        }
        showAddedWords();
      } else {
        document.getElementById('inputed-is-wrong').style.display = 'block';
      }
    });

    function escapeHTML(str) {
      str = str.replace(/&/g, '&amp;');
      str = str.replace(/</g, '&lt;');
      str = str.replace(/>/g, '&gt;');
      str = str.replace(/"/g, '&quot;');
      str = str.replace(/'/g, '&#39;');
      return str;
    }

    function decodeHTML(str) {
      str = str.replace(/&amp;/g, '&');
      str = str.replace(/&lt;/g, '<;');
      str = str.replace(/&gt;/g, '>');
      str = str.replace(/&quot;/g, '"');
      str = str.replace(/&#39;/g, "'");
      return str;
    }

    function escapeHTML_2(str) {
      str = str.replace(/</g, '&lt;');
      str = str.replace(/>/g, '&gt;');
      str = str.replace(/"/g, '&quot;');
      str = str.replace(/'/g, '&#39;');
      return str;
    }

    $('#button-go-backup').click(function () {
      $('#comment-sorry').css('display', 'none');
      $('#select-panel').css('display', 'none');
      $('#backup-panel').css('display', 'block');
      $('#button-go-backup').css('display', 'none');
      $('#button-back').css('display', 'block');
      $('#comment-qnone').css('display', 'none');
    });

    $('#button-create-backup').click(function () {
      const BackupData = [];
      for (let a = 1; a <= questions.length; a++) {
        let getBackup = localStorage.getItem(String(a));
        BackupData.push(getBackup);
      }
      if (BackupData.length > 0) {
        let blob = new Blob([BackupData.join('|||')], { type: 'text/plan' });
        let link = document.createElement('a');
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        link.href = URL.createObjectURL(blob);
        link.download = 'EwordsMemo_' + year + '_' + month + '_' + date + '.eback';
        link.click();
        $('#comment-report').css('visibility', 'hidden');
      } else {
        $('#comment-report').css('visibility', 'visible');
      }
    });

    document.getElementById('button-load-backup').addEventListener('change', function (evt) {
      let input = evt.target;
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = function () {
        let decodeData = reader.result.split('|||');
        let o = 1;
        while (localStorage.getItem(String(o)) !== null) {
          localStorage.removeItem(String(o));
          o++;
        }
        for (let i = 0; i < decodeData.length; i++) {
          localStorage.setItem(String(i + 1), escapeHTML_2(decodeData[i]));
        }
        $('#comment-load-completed').css('display', 'block');
      };
      reader.readAsText(file);
      showAddedWords();
    });

    $('#button-start').click(function () {
      gameMode = 1;
      if (questions.length !== 0) {
        $('#comment-qnone').css('display', 'none');
        $('#comment-sorry').css('display', 'none');
        $('#select-panel').css('display', 'none');
        $('#game-panel').css('display', 'block');
        $('#button-back').css('display', 'block');
        $('#comment-list-forget-word').css('display', 'block');
        $('#list-forget-word').css('display', 'block');
        $('#result').text('');
        $('#correct-answer').text('');
        $('#answer').val('');
        qNumber = -1;
        for (var i = questions.length - 1; i > 0; i--) {
          var r = Math.floor(Math.random() * (i + 1));
          var tmp = questions[i];
          questions[i] = questions[r];
          questions[r] = tmp;
        }
        setQuestion();
      } else {
        $('#comment-qnone')
          .css('display', 'block')
          .html('問題がまだ登録されておりません。<br>「Setting」より問題を追加してください。');
      }
    });

    $('#button-start2').click(function () {
      gameMode = 2;
      if (questions.length > 3) {
        $('#comment-sorry').css('display', 'none');
        $('#select-panel').css('display', 'none');
        $('#game-panel2').css('display', 'block');
        $('#button-back').css('display', 'block');
        $('#comment-list-forget-word').css('display', 'block');
        $('#list-forget-word').css('display', 'block');
        $('#result2').text('');
        $('#correct-answer2').text('');
        qNumber = -1;
        for (var i = questions.length - 1; i > 0; i--) {
          var r = Math.floor(Math.random() * (i + 1));
          var tmp = questions[i];
          questions[i] = questions[r];
          questions[r] = tmp;
        }
        setQuestion2();
      } else {
        $('#comment-qnone')
          .css('display', 'block')
          .html('問題が4問以上登録されておりません。<br>「Setting」より問題を追加してください。');
      }
    });

    $('#button-start3').click(function () {
      gameMode = 3;
      if (questions.length > 3) {
        $('#comment-sorry').css('display', 'none');
        $('#select-panel').css('display', 'none');
        $('#game-panel2').css('display', 'block');
        $('#button-back').css('display', 'block');
        $('#comment-list-forget-word').css('display', 'block');
        $('#list-forget-word').css('display', 'block');
        $('#result2').text('');
        $('#correct-answer2').text('');
        qNumber = -1;
        for (var i = questions.length - 1; i > 0; i--) {
          var r = Math.floor(Math.random() * (i + 1));
          var tmp = questions[i];
          questions[i] = questions[r];
          questions[r] = tmp;
        }
        setQuestion3();
      } else {
        $('#comment-qnone')
          .css('display', 'block')
          .html('問題が4問以上登録されておりません。<br>「Setting」より問題を追加してください。');
      }
    });

    $('#button-hidden-forget-word').click(function () {
      if (hiddenSwitch) {
        hiddenSwitch = false;
        $(this).text('答えを非表示');
        if (gameMode === 1 || gameMode === 3) {
          $('.forget-english').css('visibility', 'visible');
        } else if (gameMode === 2) {
          $('.forget-japanese').css('visibility', 'visible');
        }
      } else {
        hiddenSwitch = true;
        $(this).text('答えを表示');
        if (gameMode === 1 || gameMode === 3) {
          $('.forget-english').css('visibility', 'hidden');
        } else if (gameMode === 2) {
          $('.forget-japanese').css('visibility', 'hidden');
        }
      }
    });

    $('#button-check').click(function () {
      let $answer = escapeHTML($('#answer').val());
      document.getElementById('button-check').disabled = true;
      if ($answer === questions[qNumber].word) {
        $('#result').text('OK!');
        point++;
      } else {
        $('#result').text("Oops! Let's check the answer.");
        $('#correct-answer').html('A. ' + questions[qNumber].word);
        $('#list-forget-word').append(
          '<li class="forget-english">' +
            questions[qNumber].frontExample +
            questions[qNumber].word +
            questions[qNumber].backExample +
            '</li><li class="forget-japanese">' +
            questions[qNumber].exampleJapanese +
            '</li>'
        );
      }
      $('#button-next').css('display', 'block');
      if (qNumber === questions.length - 1) {
        $('#button-next').css('display', 'none');
        $('#comment-end').text("That's all. Good job! (" + point + '/' + questions.length + ')');
        $('#button-hidden-forget-word').css('display', 'block');
      }
    });

    $('.btn-answer').click(function () {
      if (rflag === false) {
        let id = $(this).attr('id');
        document.getElementById('btn-answer1').disabled = true;
        document.getElementById('btn-answer2').disabled = true;
        document.getElementById('btn-answer3').disabled = true;
        document.getElementById('btn-answer4').disabled = true;
        document.getElementById(id).disabled = false;
        if (gameMode === 2) {
          if ($(this).text() === decodeHTML(questions[qNumber].exampleJapanese)) {
            $('#result2').text('OK!');
            point++;
          } else {
            $('#result2').text("Oops! Let's check the answer.");
            $('#correct-answer2').html('A. ' + questions[qNumber].exampleJapanese);
            $('#list-forget-word').append(
              '<li class="forget-english">' +
                questions[qNumber].frontExample +
                questions[qNumber].word +
                questions[qNumber].backExample +
                '</li><li class="forget-japanese">' +
                questions[qNumber].exampleJapanese +
                '</li>'
            );
          }
        } else if (gameMode === 3) {
          if (
            $(this).text() ===
            decodeHTML(questions[qNumber].frontExample + questions[qNumber].word + questions[qNumber].backExample)
          ) {
            $('#result2').text('OK!');
            point++;
          } else {
            $('#result2').text("Oops! Let's check the answer.");
            $('#correct-answer2').html(
              'A. ' + questions[qNumber].frontExample + questions[qNumber].word + questions[qNumber].backExample
            );
            $('#list-forget-word').append(
              '<li class="forget-english">' +
                questions[qNumber].exampleJapanese +
                '</li><li class="forget-japanese">' +
                questions[qNumber].frontExample +
                questions[qNumber].word +
                questions[qNumber].backExample +
                '</li>'
            );
          }
        }
        $('#button-next').css('display', 'block');
        if (qNumber === questions.length - 1) {
          $('#button-next').css('display', 'none');
          $('#comment-end2').text("That's all. Good job! (" + point + '/' + questions.length + ')');
          $('#button-hidden-forget-word').css('display', 'block');
        }
        rflag = true;
      }
    });

    $('#button-next').click(function () {
      if (gameMode === 1) {
        setQuestion();
        $('#result').text('');
        $('#correct-answer').text('');
        $('#answer').val('');
        document.getElementById('button-check').disabled = false;
        $('#button-next').css('display', 'none');
      } else if (gameMode === 2) {
        setQuestion2();
        rflag = false;
        $('#result2').text('');
        $('#correct-answer2').text('');
        document.getElementById('btn-answer1').disabled = false;
        document.getElementById('btn-answer2').disabled = false;
        document.getElementById('btn-answer3').disabled = false;
        document.getElementById('btn-answer4').disabled = false;
        $('#button-next').css('display', 'none');
      } else if (gameMode === 3) {
        setQuestion3();
        rflag = false;
        $('#result2').text('');
        $('#correct-answer2').text('');
        document.getElementById('btn-answer1').disabled = false;
        document.getElementById('btn-answer2').disabled = false;
        document.getElementById('btn-answer3').disabled = false;
        document.getElementById('btn-answer4').disabled = false;
        $('#button-next').css('display', 'none');
      }
    });

    $('#button-back').click(function () {
      document.location.reload();
    });

    function setQuestion() {
      qNumber++;
      $('#example-sentence').html(
        questions[qNumber].frontExample +
          ' <span id="question-border"><span class="question">space</span></span> ' +
          questions[qNumber].backExample
      );
      $('#example-sentence-japanese').html(questions[qNumber].exampleJapanese);
    }

    function setQuestion2() {
      var questions2 = [];
      qNumber++;
      $('#example-sentence2').html(
        questions[qNumber].frontExample + questions[qNumber].word + questions[qNumber].backExample
      );
      questions2.push(questions[qNumber].exampleJapanese);
      while (questions2.length < 4) {
        var r = Math.floor(Math.random() * questions.length);
        var plus = questions[r].exampleJapanese;
        var dflag = false;
        for (var j = 0; j < questions2.length; j++) {
          if (questions2[j] === plus) {
            dflag = true;
          }
        }
        if (dflag === false) {
          questions2.push(plus);
        }
      }
      for (var i = questions2.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        var tmp = questions2[i];
        questions2[i] = questions2[r];
        questions2[r] = tmp;
      }
      $('#btn-answer1').text(decodeHTML(questions2[0]));
      $('#btn-answer2').text(decodeHTML(questions2[1]));
      $('#btn-answer3').text(decodeHTML(questions2[2]));
      $('#btn-answer4').text(decodeHTML(questions2[3]));
    }

    function setQuestion3() {
      var questions3 = [];
      qNumber++;
      $('#example-sentence2').html(questions[qNumber].exampleJapanese);
      questions3.push(questions[qNumber].frontExample + questions[qNumber].word + questions[qNumber].backExample);
      while (questions3.length < 4) {
        var r = Math.floor(Math.random() * questions.length);
        var plus = questions[r].frontExample + questions[r].word + questions[r].backExample;
        var dflag = false;
        for (var j = 0; j < questions3.length; j++) {
          if (questions3[j] === plus) {
            dflag = true;
          }
        }
        if (dflag === false) {
          questions3.push(plus);
        }
      }
      for (var i = questions3.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        var tmp = questions3[i];
        questions3[i] = questions3[r];
        questions3[r] = tmp;
      }
      $('#btn-answer1').text(decodeHTML(questions3[0]));
      $('#btn-answer2').text(decodeHTML(questions3[1]));
      $('#btn-answer3').text(decodeHTML(questions3[2]));
      $('#btn-answer4').text(decodeHTML(questions3[3]));
    }

    function setQuestionString() {
      questions.length = 0;
      j = 1;
      while (localStorage.getItem(String(j)) !== null) {
        getArray = localStorage.getItem(String(j));
        decodeArray = getArray.split('^^^');
        questions.push({
          word: decodeArray[0],
          frontExample: decodeArray[1],
          backExample: decodeArray[2],
          exampleJapanese: decodeArray[3],
        });
        j++;
      }
    }

    function showAddedWords() {
      setQuestionString();
      $('#list-word').html('');
      for (let n = 0; n < questions.length; n++) {
        $('#list-word').append(
          '<li>' +
            questions[n].word +
            ' 　<button class="button-delete" id="' +
            (n + 1) +
            '" tabindex="-1">☓</button></li><br>'
        );
      }
    }

    $('#button-all-delete').click(function () {
      let o = 1;
      while (localStorage.getItem(String(o)) !== null) {
        localStorage.removeItem(String(o));
        o++;
      }
      showAddedWords();
    });

    $('#list-word').on('click', '.button-delete', function () {
      let wordNumber = 0;
      let value;
      wordNumber = $(this).attr('id');
      localStorage.removeItem(wordNumber);
      wordNumber++;
      while (localStorage.getItem(String(wordNumber)) !== null) {
        value = localStorage.getItem(String(wordNumber));
        localStorage.setItem(String(wordNumber - 1), value);
        localStorage.removeItem(wordNumber);
        wordNumber++;
      }
      if (localValue > 1) {
        localValue--;
      }
      $(this).parent().css('display', 'none');
      showAddedWords();
    });

    document.addEventListener('keypress', function (event) {
      if (gameMode === 1) {
        if (event.key !== 'Enter') {
          if (
            !document.getElementById('button-check').disabled &&
            !(event.key === 'Backspace' || event.code === 'Backspace')
          ) {
            keyboardInputChar(event.key);
          }
        } else {
          if (!document.getElementById('button-check').disabled) {
            keyboardCheckAnswer();
            document.getElementById('button-check').click();
          } else {
            document.getElementById('button-next').click();
          }
        }
      }
    });
    document.addEventListener('keydown', function (event) {
      if (gameMode === 1) {
        if (event.key === 'Backspace' || event.code === 'Backspace') {
          if (!document.getElementById('button-check').disabled) {
            keyboardBackSpace();
          }
        }
      }
    });

    const keyboardInputChar = (char) => {
      document.getElementById('answer').value += char;
    };

    const keyboardBackSpace = () => {
      document.getElementById('answer').value = document.getElementById('answer').value.slice(0, -1);
    };

    const keyboardCheckAnswer = () => {
      document.getElementById('keyboard-panel').style.display = 'none';
      document.getElementById('keyboard-modal').style.display = 'none';
    };

    const keyboardShiftOn = () => {
      flagShift = true;
      keyboardTips[20].texture = keyboardTipsSheet.textures[keyboardTipsList[36].path];
    };

    const keyboardShiftOff = () => {
      flagShift = false;
      keyboardTips[20].texture = keyboardTipsSheet.textures[keyboardTipsList[20].path];
    };
  });
});
