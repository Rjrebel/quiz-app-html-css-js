/************************************
 * ********* Quiz Controller ********
 * **********************************/

var quizController = (function () {
  /***********Question Constructor */

  function Question(id, questionText, options, correctAns) {
    this.id = id;
    this.questionText = questionText;
    this.options = options;
    this.correctAns = correctAns;
  }
  var questionLocalStorage = {
    setQuestionCollection: function (newCollection) {
      localStorage.setItem("questionCollection", JSON.stringify(newCollection));
    },
    getQuestionCollection: function () {
      return JSON.parse(localStorage.getItem("questionCollection"));
    },
    reomoveQuestionCollection: function () {
      localStorage.removeItem("questionCollection");
    },
  };
   var quizProgress = {
       questIndex : 0,
   };
  
  if (questionLocalStorage.getQuestionCollection() === null) {
    questionLocalStorage.setQuestionCollection([]);
  };
  /********* Person Constructo ***********/
  function Person(id, fName, lName, score){
     this.id = id;
     this.fName = fName;
     this.lName = lName;
     this.score = score;
  };

  var currPersonData = {
    fullName : [],
    score : 0
  };

  var adminFullName = ['Rohit', 'Jibhakate'];

  var personLocalStorage = {
    setPersonCollection: function (newCollection) {
      localStorage.setItem("personCollection", JSON.stringify(newCollection));
    },
    getPersonCollection: function () {
      return JSON.parse(localStorage.getItem("personCollection"));
    },
    reomovePersonCollection: function () {
      localStorage.removeItem("personCollection");
    },
  };
  if (personLocalStorage.getPersonCollection() === null) {
    personLocalStorage.setPersonCollection([]);
  };
  return {
    getQuizProgress : quizProgress,
    getQuestionLocalStorage : questionLocalStorage,
    addQuestInLocalStorage: function (newQuestText, opts) {
      var optnsArr, correctAnswer, questionId, newQuestion, getStoredQuests, isChecked;
      optnsArr = [];
      isChecked = false;

      if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
      }

      for (var i = 0; i < opts.length; i++) {
        if (opts[i].value !== "") {
          optnsArr.push(opts[i].value);
        }
        if (opts[i].previousElementSibling.checked && opts[i].value !== "") {
          correctAnswer = opts[i].value;
          isChecked = true;
        }
      }

      /**** Id */
      if (questionLocalStorage.getQuestionCollection().length > 0) {
        questionId =
          questionLocalStorage.getQuestionCollection()[
            questionLocalStorage.getQuestionCollection().length - 1
          ].id + 1;
      } else {
        questionId = 0;
      }
      if (newQuestText.value !== "") {
        if (optnsArr.length > 1) {
          if(isChecked){
          
          newQuestion = new Question(
            questionId,
            newQuestText.value,
            optnsArr,
            correctAnswer
          );
          getStoredQuests = questionLocalStorage.getQuestionCollection();
          getStoredQuests.push(newQuestion);
          questionLocalStorage.setQuestionCollection(getStoredQuests);
          newQuestText.value = "";
          for (var x = 0; x < opts.length; x++) {
            opts[x].value = "";
            opts[x].previousElementSibling.checked = false;
          }
            return true;
          }
          else{
            alert('You must check one of the option or You have checked empty option')
            return false;
          }
        }
        else {
          alert("You must include atleast 2 options");
          return false;
        }
      }
      else {
        alert("Please insert a question");
        return false;
      }
    },
    checkAnswer : function(ans){
      if(questionLocalStorage.getQuestionCollection()[quizProgress.questIndex].correctAns === ans.textContent){
          currPersonData.score ++ ;
          return true ;
          
        }  
        else {
          return false ;
          
        }   
    },
    addPerson : function(){
       var newPerson, personId, personCollection;
       if(personLocalStorage.getPersonCollection().length > 0){
          personId = personLocalStorage.getPersonCollection()[personLocalStorage.getPersonCollection().length-1].id + 1;
       } else {
        personId =0;
       }
       newPerson = new Person(personId, currPersonData.fullName[0], currPersonData.fullName[1],currPersonData.score);
       console.log(newPerson);
       personCollection = personLocalStorage.getPersonCollection();

       personCollection.push(newPerson);
       personLocalStorage.setPersonCollection(personCollection);
       
    },
    isFinished : function(){
      return  quizProgress.questIndex + 1 === questionLocalStorage.getQuestionCollection().length;
    },
    getCurrPersonData : currPersonData,
    getAdminFullName : adminFullName,
    getPersonLocalStorage : personLocalStorage,
  };
})();

/************************************
 * ********* UI Controller ********
 * **********************************/

var UIController = (function () {
  var domItems = {
    /************* Admin panel elements ******/
    adminPanelSection : document.querySelector(".admin-panel-container"),
    questInsertBtn: document.getElementById("question-insert-btn"),
    newQuestionText: document.getElementById("new-question-text"),
    adminOptions: document.querySelectorAll(".admin-option"),
    adminOptionsContainer: document.querySelector(".admin-options-container"),
    insertedQuestionsWrapper : document.querySelector(".inserted-questions-wrapper"),
    questUpdateBtn : document.getElementById("question-update-btn"),
    questDeleteBtn : document.getElementById("question-delete-btn"),
    questClearBtn : document.getElementById("questions-clear-btn"),
    resultClearBtn : document.getElementById("results-clear-btn"),
    resultListWrapper : document.querySelector(".results-list-wrapper"),

    /********************* Quiz section  *******/
    quizPageSection : document.querySelector(".quiz-container"),
    askedQuestText : document.getElementById("asked-question-text"),
    quizOptionWrapper : document.querySelector(".quiz-options-wrapper"),
    progressBar : document.querySelector("progress"),
    progressPar : document.getElementById("progress"),
    instantAnsContainer : document.querySelector(".instant-answer-container"),
    instAnsText : document.getElementById("instant-answer-text"),
    instAnsDiv : document.getElementById("instant-answer-wrapper"),
    emotionIcon : document.getElementById("emotion"),
    nextQuestBtn : document.getElementById("next-question-btn"),
    /************** Landing Page Elements */
    landingPageSection : document.querySelector(".landing-page-container"),
    startQuizBtn : document.getElementById("start-quiz-btn"),
    firstNameInput : document.getElementById("firstname"),
    lastNameInput : document.getElementById("lastname"),
    /************************Final Result Section */
    finalResultSection : document.querySelector(".final-result-container"),
    finalScoreText : document.getElementById("final-score-text"),
    finalLogoutBtn : document.getElementById("final-logout-btn"),

  };
  return {
    getDomItems: domItems,
    

    addInputsDynamically : function(){
      var addInput  = function(){
          var inputHtml, z;
          z = document.querySelectorAll('.admin-option');
          inputHtml = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' +z+ '" name="answer" value="' +z+ '"><input type="text" class="admin-option admin-option-' +z+ '" value=""></div>';
          domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHtml);
          domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
          domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
      }

      domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
    },
    createQuestionList : function(getQuestions){
          var questionHtml;
          domItems.insertedQuestionsWrapper.innerHTML = "";
          for(var i =0; i < getQuestions.getQuestionCollection().length ; i++){
            questionHtml = '<p><span>' +(i+1)+ '. ' +getQuestions.getQuestionCollection()[i].questionText+ '</span><button id="question-' +(i)+ '">Edit</button></p>'
            domItems.insertedQuestionsWrapper.insertAdjacentHTML('afterbegin', questionHtml)
          }
          
    },
    editQuestList : function(event, storageQuestList, addInptsDynFn, updateQuestListFn){
      var getId, getStorageQuestList, foundItem, placeInArray, optionsHtml;
        if('question-'.indexOf(event.target.id)){
          getId = parseInt(event.target.id.split('-')[1]);
          getStorageQuestList = storageQuestList.getQuestionCollection();
          for(var i=0; i<getStorageQuestList.length; i++){
            if(getStorageQuestList[i].id === getId){
                foundItem = getStorageQuestList[i];
                placeInArray = i;
            }
          }
        }
        domItems.newQuestionText.value = foundItem.questionText;
        domItems.adminOptionsContainer.innerHTML = "";
        optionsHtml = '';

        for(var x=0 ; x<foundItem.options.length; x++){
          optionsHtml += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' +x+ '" name="answer" value="' +x+ '"><input type="text" class="admin-option admin-option-' +x+ '" value="' +foundItem.options[x]+ '"></div>'
        }
        domItems.adminOptionsContainer.innerHTML = optionsHtml;
        addInptsDynFn();

        var backDefaultView = function(){
          var updateOptions;
          domItems.newQuestionText.value = '';
          updateOptions =  document.querySelectorAll(".admin-option");
          for(var i=0 ; i < updateOptions.length; i++){
            updateOptions[i].value = '';
            updateOptions[i].previousElementSibling.checked = false;
          }
          domItems.questDeleteBtn.style.visibility = 'hidden';
          domItems.questUpdateBtn.style.visibility = 'hidden';
          domItems.questInsertBtn.style.visibility = 'visible';
          domItems.questClearBtn.style.pointerEvents = '';
          updateQuestListFn(storageQuestList);
        };
        
        domItems.questDeleteBtn.style.visibility = 'visible';
        domItems.questUpdateBtn.style.visibility = 'visible';
        domItems.questInsertBtn.style.visibility = 'hidden';
        domItems.questClearBtn.style.pointerEvents = 'none';
        var updateQuestion = function(){
          var newOptions, optnElements;

          optnElements =  document.querySelectorAll(".admin-option");

          newOptions = [];
          foundItem.questionText = domItems.newQuestionText.value;
          foundItem.correctAns = '';
          for (var i = 0;i< optnElements.length; i++) {
            if (optnElements[i].value !== "") {
              newOptions.push(optnElements[i].value);
              if (optnElements[i].previousElementSibling.checked) {
                foundItem.correctAnswer = optnElements[i].value;
                isChecked = true;
              }
            }
            
          }
          foundItem.options = newOptions;
          if(foundItem.questionText !== ""){
            if(foundItem.options.length > 1) {
              if(foundItem.correctAnswer !== ""){
                 getStorageQuestList.splice(placeInArray, 1, foundItem);
                 storageQuestList.setQuestionCollection(getStorageQuestList);
                 backDefaultView();
              }
              else{
                  alert("you must check any one of the option");
              }
            }
            else{
                 alert("You must insert atleast two options");
            }
          }
          else{
                 alert('Question can not be empty.');
          }
          
        }
        domItems.questUpdateBtn.onclick = updateQuestion;

        var deleteQuestion= function(){
          getStorageQuestList.splice(placeInArray, 1);
          storageQuestList.setQuestionCollection(getStorageQuestList);
          backDefaultView();
        };

        domItems.questDeleteBtn.onclick = deleteQuestion ;
    },

    clearQuestList : function(storageQuestList){
        if(storageQuestList.getQuestionCollection() !== null){
          if(storageQuestList.getQuestionCollection().length > 0){
          var conf = confirm("Warning !!! You will loose all your question.");
          
          if(conf){
            storageQuestList.reomoveQuestionCollection();
            domItems.insertedQuestionsWrapper.innerHTML = '';
          }
         }}
         
    },

    displayQuestion : function(storageQuestList, progress){
        var newOptionHtml, charArray;
          charArray = ["A", "B", "C", "D", "E", "F", "G"];
          if(storageQuestList.getQuestionCollection().length > 0){
             domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[progress.questIndex].questionText;
             domItems.quizOptionWrapper.innerHTML = '';
             for(var i=0; i < storageQuestList.getQuestionCollection()[progress.questIndex].options.length; i++){
                newOptionHtml = '  <div class="choice-' +i+ '"><span class="choice-' +i+ '">' +charArray[i]+ '</span><p  class="choice-' +i+ '">' +storageQuestList.getQuestionCollection()[progress.questIndex].options[i]+ '</p></div>';
                domItems.quizOptionWrapper.insertAdjacentHTML("beforeend", newOptionHtml);
             }
          }
          
    },

    displayProgress : function(storageQuestList, progress){

      domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
      domItems.progressBar.value = progress.questIndex + 1 ;
      domItems.progressPar.textContent = (progress.questIndex + 1)+ '/'+ storageQuestList.getQuestionCollection().length;

    },
    newDesign : function(ansResult, selectedAnswer){       
           var twoOptions, index;
           index = 0;
           if(ansResult){
            index = 1;
           }
           twoOptions = {
               instAnswerText : ["This is a wrong answer", "This is a correct answer"],
               instAnswerClass : [ "red", "green"],
               emojis : ['images/sad.png', 'images/happy.png'],
               background : ['rgba(200,0,0,0.7)', 'rgba(0,300,0,0.2)']
           };
           domItems.quizOptionWrapper.style.cssText = "opacity : 0.6 ; pointer-events : none;";
           domItems.instantAnsContainer.style.opacity = "1";
           domItems.instAnsText.textContent = '';
           domItems.instAnsText.textContent = twoOptions.instAnswerText[index];
           domItems.instAnsDiv.className = twoOptions.instAnswerClass[index];
           domItems.emotionIcon.setAttribute('src', twoOptions.emojis[index]);
           selectedAnswer.previousElementSibling.style.background = twoOptions.background[index];
    },

    resetDesign : function(){
          domItems.quizOptionWrapper.style.cssText = "";
          domItems.instantAnsContainer.style.opacity = "0";
    },

    getFullName : function(currPersn, questCollection, admin){
          if(!(domItems.firstNameInput.value=== "" || domItems.lastNameInput.value === "")){
            if(!(domItems.firstNameInput.value=== admin[0] && domItems.lastNameInput.value === admin[1])){
              if(questCollection.getQuestionCollection().length > 0){
                currPersn.fullName.push(domItems.firstNameInput.value);
                currPersn.fullName.push(domItems.lastNameInput.value);
               console.log(currPersn);
               domItems.landingPageSection.style = " display : none ;";
               domItems.quizPageSection.style = " display : block ;";
              } else{
                alert("Quiz is not ready, Plz contact admin !!!")
              }
            
             } else {
              domItems.landingPageSection.style = " display : none ;";
              domItems.adminPanelSection.style = " display : block ;";
              
             }
          } else {
                  alert("Please fill all the inputs!!!")
          }
    },

    finalResult : function(CrntPerson, questdata){
          domItems.finalScoreText.textContent = CrntPerson.fullName[0]+ ' '+ CrntPerson.fullName[1] + ', your final score is '+ CrntPerson.score + ' outoff '+ questdata.getQuestionCollection().length;
          domItems.quizPageSection.style = " display : none ;";
          domItems.finalResultSection.style = " display : block ;";
              
    },

    showResultOnpanel : function(personList){
      var resultHtml;
      domItems.resultListWrapper.innerHTML = "";
      for(var i =0; i < personList.getPersonCollection().length ; i++){
        resultHtml =  '<p class="person person-' +(i)+ '"><span class="person-' +(i+1)+ '">' +(personList.getPersonCollection()[i].fName)+ ' ' +(personList.getPersonCollection()[i].lName)+ ' - ' +(personList.getPersonCollection()[i].score)+ ' Points</span><button id="delete-result-btn_' +(personList.getPersonCollection()[i].id)+ '" class="delete-result-btn">Delete</button></p>'
        domItems.resultListWrapper.insertAdjacentHTML('afterbegin', resultHtml)
      }
    },

    deleteResult : function(event, userdata){
            var getId, personsArr;
            personsArr = userdata.getPersonCollection();
            if('delete-result-btn_'.indexOf(event.target.id)){
                getId = parseInt(event.target.id.split('_')[1]);
                for(var i= 0; i < personsArr.length; i++){
                  if(personsArr[i].id === getId){
                    personsArr.splice(i,1);
                    userdata.setPersonCollection(personsArr);
                  }
                }
                
            }
    },

    clearResultList : function(userdata){
        if(userdata.getPersonCollection() !== null){
          if(userdata.getPersonCollection().length > 0){
            var conf = confirm("You'll loose all the data");
            if(conf){
              userdata.reomovePersonCollection();
              domItems.resultListWrapper.innerHTML = '';
            }
           }
        }
    },
    
  };
})();

/************************************
 * ********* Controller ********
 * **********************************/

var controller = (function (quizctrl, uictrl) {
  var selectedDomItems = UIController.getDomItems;
  uictrl.addInputsDynamically();
  uictrl.createQuestionList(quizctrl.getQuestionLocalStorage);

  selectedDomItems.questInsertBtn.addEventListener("click", function () {
    var adminOptions = document.querySelectorAll('.admin-option')
    var checkBoolean = quizController.addQuestInLocalStorage(
      selectedDomItems.newQuestionText,
      adminOptions
    );
    if(checkBoolean){
      uictrl.createQuestionList(quizctrl.getQuestionLocalStorage);
    };
  });
  selectedDomItems.insertedQuestionsWrapper.addEventListener('click', function(e){
          uictrl.editQuestList(e, quizctrl.getQuestionLocalStorage, uictrl.addInputsDynamically, uictrl.createQuestionList);
  });
  selectedDomItems.questClearBtn.addEventListener('click', function(){
        uictrl.clearQuestList(quizctrl.getQuestionLocalStorage);
  });
  uictrl.displayQuestion(quizctrl.getQuestionLocalStorage, quizctrl.getQuizProgress);
  uictrl.displayProgress(quizctrl.getQuestionLocalStorage, quizctrl.getQuizProgress);
  selectedDomItems.quizOptionWrapper.addEventListener('click', function(e){
    var updatedOptionDiv = selectedDomItems.quizOptionWrapper.querySelectorAll('div');
    for(var i =0 ; i < updatedOptionDiv.length ; i++){
      if(e.target.className  ===  'choice-'+i){
        var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
         var answerResult = quizctrl.checkAnswer(answer);
        uictrl.newDesign(answerResult, answer);
        
      }
    }
    
  });
  if(quizctrl.isFinished()){
    selectedDomItems.nextQuestBtn.textContent= "finish";
  };
  var nextQuestion = function(){
    if(quizctrl.isFinished()){
      quizctrl.addPerson();
      uictrl.finalResult(quizctrl.getCurrPersonData, quizctrl.getQuestionLocalStorage);
      
    } else {
       uictrl.resetDesign();
       quizctrl.getQuizProgress.questIndex++;
       uictrl.displayQuestion(quizctrl.getQuestionLocalStorage, quizctrl.getQuizProgress);
       uictrl.displayProgress(quizctrl.getQuestionLocalStorage, quizctrl.getQuizProgress);

    }
  }
  selectedDomItems.nextQuestBtn.onclick = function(){
    nextQuestion();
  };
  selectedDomItems.startQuizBtn.addEventListener('click', function(e){
    uictrl.getFullName(quizctrl.getCurrPersonData, quizctrl.getQuestionLocalStorage, quizctrl.getAdminFullName)
    console.log(e);
    
    
  });
  selectedDomItems.lastNameInput.addEventListener('focus', function(){
    selectedDomItems.lastNameInput.addEventListener('keypress', function(e){
      if(e.charCode === 13){
        uictrl.getFullName(quizctrl.getCurrPersonData, quizctrl.getQuestionLocalStorage, quizctrl.getAdminFullName)
      }
    })
  });
  uictrl.showResultOnpanel(quizctrl.getPersonLocalStorage);
  selectedDomItems.resultListWrapper.addEventListener('click', function(e){
    uictrl.deleteResult(e, quizctrl.getPersonLocalStorage);
    uictrl.showResultOnpanel(quizctrl.getPersonLocalStorage);
  });
  selectedDomItems.resultClearBtn.addEventListener('click', function(){
    uictrl.clearResultList(quizctrl.getPersonLocalStorage);
    uictrl.showResultOnpanel(quizctrl.getPersonLocalStorage);
  })
})(quizController, UIController);
