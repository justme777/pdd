    var sectionNumber=getParameterByName('section');
        if(sectionNumber==''){sectionNumber=1;}
        $('#section'+sectionNumber).addClass('active');
        var answers = getAnswers(sectionNumber);
        var myanswers=[];

        var qNumber = getParameterByName('qNumber');
        if(qNumber==''){qNumber=1;}

        showQuestion(qNumber);
        
        showArrows(false);

        function getImagePath(qNumber){
            var imgNumber = Math.floor((qNumber-1)/8)+1;
            return "images/"+sectionNumber+"/"+imgNumber+".jpg";
        }

        function getRowNumber(qNumber){
            return (Math.floor((qNumber-1)/4)%2)+1;
        }

        function getColumnNumber(qNumber){
            var r = qNumber%4;
            if(r==0){ r=4;}
            return r;
        }

        function getX(rowNumber){
            var width = 600;
            var dX = 150;
            var x0 = 0;
            return x0+(rowNumber-1)*(width-dX);
        }

        function getY(colNumber){
            var h = 600;
            var dY = 30;
            var y0 = 150;
            return y0+(colNumber-1)*(h-dY);
        }

        function setPosition(qNumber){
            var rowNumber = getRowNumber(qNumber);
            
            var colNumber = getColumnNumber(qNumber);
            
            x = getX(colNumber);
            y = getY(rowNumber);
            //alert('row='+rowNumber+" col="+colNumber+' x='+x+' y='+y);
            $('#clip').css('left','-'+x+'px');
            $('#clip').css('top','-'+y+'px');
        }
        
        function showQuestion(qNumber){
            $('#lblQuestionNumber').text('Вопрос '+qNumber);
            var path = getImagePath(qNumber);
            if(isFileExist(path)==true)
            {
                $('#clip').attr('src',path);
                setPosition(qNumber);
                var myAnswer = getMyAnswer(qNumber);
                if(myAnswer){
                    selectMyAnswer(myAnswer);
                }else{
                    clearAnswerSelection();
                }
            }
            if($('#clip').attr('src')==null){ 
                alert('К сожалению, нужная картинка еще не загружена в систему');
             }
        }

        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        function showNextQuestion(){
            var selectedAnswer = getSelectedAnswer();
            if(selectedAnswer!="0"){
                setMyAnswer(myanswers,qNumber,selectedAnswer);
                qNumber++;
                if(qNumber>answers.length){ 
                    qNumber=answers.length;
                    showResults();
             }
                showQuestion(qNumber);
            }else{
                alert("Вы не ответили на вопрос");
            }
            
        }

        function showPrevQuestion(){
            qNumber--;
            if(qNumber<1){qNumber=1;}
            showQuestion(qNumber);
            var myAnswer =getMyAnswer(qNumber);
            selectMyAnswer(myAnswer);
        }

        $('.td_arrow').hover(function(){
            showArrows(true);
        });

        $('.td_arrow').mouseout(function(){
            showArrows(false);
        });

        $('.arrow').hover(function(){
            showArrows(true);
        });

        function showArrows(isVisible){
            if(isVisible==true){
                $('#img_up').show();
                $('#img_left').show();
                $('#img_right').show();
                $('#img_down').show();
            }else{
                $('#img_up').hide();
                $('#img_left').hide();
                $('#img_right').hide();
                $('#img_down').hide();
            }
        }

        $('#img_up').click(function(){
            var top = $('#clip').css('top');
            var number = getNumber(top);
            number=number-10;
            top = makePixelValue(number);
            var left = $('#clip').css('left');
            move(top, left);
        });

        $('#img_down').click(function(){
            var top = $('#clip').css('top');
            var number = getNumber(top);
            number=number+10;
            top = makePixelValue(number);
            var left = $('#clip').css('left');
            move(top, left);
        });

        $('#img_left').click(function(){
            var top = $('#clip').css('top');
            var left = $('#clip').css('left');
            var number = getNumber(left);
            number=number-10;
            left = makePixelValue(number);
            move(top, left);
        });
        
        $('#img_right').click(function(){
            var top = $('#clip').css('top');
            var left = $('#clip').css('left');
            var number = getNumber(left);
            number=number+10;
            left = makePixelValue(number);
            move(top, left);
        });

        function getNumber(str){
            return Number(str.replace(/[^0-9]/g,''));
        }

        function makePixelValue(number){
            return "-"+number+"px";
        }

        function move(top, left){
            $('#clip').css('top',top);
            $('#clip').css('left',left);
        }

        function getAnswers(sectionNumber){
            switch(sectionNumber){
                case "13": return "114322322313421211313153314331212131321231332233125131111121114221241323311331333113341213312141323213";break;
            }
        }

        function setAnswerSize(answers){
            var str="";
            for(var i=0;i<answers.length;i++){
                str+="0";
            }
            return str;
        }

        function getSelectedAnswer(){
            selectedAnswer="0";
            for(var i=1;i<=5;i++){
                if($('#option'+i).prop('checked')==true){
                    selectedAnswer = i;
                    break;
                }
            }
            return selectedAnswer;
        }

        function setMyAnswer(myanswers, qNumber, myAnswer){
            myanswers[qNumber-1]=myAnswer;
        }

        function getMyAnswer(qNumber){
            return myanswers[qNumber-1];
        }

        function selectMyAnswer(myAnswer){
            $('#option'+myAnswer).prop('checked',true);
        }

        function clearAnswerSelection(){
            for(var i=1;i<=5;i++){
                $('#option'+i).prop('checked',false);
            }
        }

        function showResults(){
            $('#tbl_results').find('tr').remove();
            //$('#myTable').append('<tr><td>my data</td><td>more data</td></tr>');
            var row = '<tr><td>Вопросы</td>';
            for(var i=0;i<answers.length;i++){
                row+='<td>';
                row+=(i+1);
                row+='</td>';
            }
            row+='</tr>';
            $('#tbl_results').append(row);

            var row = "<tr><td>Ответы</td>";
            for(var i=0;i<answers.length;i++){
                var val =myanswers[i];
                if(val==null){ val="-";}
                if(val==answers[i]){
                    row+="<td onclick='showQuestion("+(i+1)+")' style='cursor:pointer;color:green;'>";
                }else{
                    row+="<td onclick='showQuestion("+(i+1)+")' style='color:red;cursor:pointer;'>";
                }
                row+=val;
                row+="</td>";
            }
            row+="</tr>";
            $('#tbl_results').append(row);

            var row = '<tr><td>Ключь</td>';
            for(var i=0;i<answers.length;i++){
                row+='<td>';
                row+=answers[i];
                row+='</td>';
            }
            row+='</tr>';
            $('#tbl_results').append(row);
            $('#div_myanswers').css('display','block');
        }

        

        function dump(obj) {
            var out = '';
            for (var i in obj) {
                out += i + ": " + obj[i] + "\n";
            }

            alert(out);

            // or, if you wanted to avoid alerts...

            var pre = document.createElement('pre');
            pre.innerHTML = out;
            document.body.appendChild(pre);
        }

        function isFileExist(path){
            var url=document.location.origin+"/"+path;
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            return http.status!=404;
        }