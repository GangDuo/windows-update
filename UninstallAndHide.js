/**********************************************************************
 WSUS���g�p�����ɕs�K�v��WindowsUpdate���\��
 
 Copyright 2015-2016 330k
 �g�p�͎��ȐӔC�ł��肢���܂�
**********************************************************************/
try{
  // �C���X�g�[�����Ȃ�WindowsUpdate��KB�ԍ�
  var disabledKBs = [
    4041693
  ].sort().reverse();
  
  var disabledKBregexp = new RegExp('(' + disabledKBs.join(')|(') + ')');
  var updateSession, updateSearcher, searchResult, update;
  var objShell = WScript.CreateObject("WScript.Shell");
  //var fso = new ActiveXObject("Scripting.FileSystemObject");
  var i, j;
  
  // WUA����
  updateSession = WScript.CreateObject("Microsoft.Update.Session");
  updateSession.ClientApplicationID = "info.330k.disable_wupdate.20160626";
  
  // ���ɃC���X�g�[������Ă��邩������Ȃ��̂ŁA�܂��A���C���X�g�[������
  for(i = 0; i < disabledKBs.length; i++){
    log("uninstall: " + disabledKBs[i]);
    objShell.Run("wusa.exe /uninstall /kb:" + disabledKBs[i] + " /quiet /norestart", 0, true);
  }
  
  // ���C���X�g�[���̏ꍇ�͔�\���ɂ���
  log("search updates which are not installed yet");
  updateSearcher = updateSession.CreateUpdateSearcher();
  searchResult = updateSearcher.Search("IsInstalled=0 and IsHidden=0");
  log("updates found: " + searchResult.Updates.Count);
  for(i = 0; i < searchResult.Updates.Count; i++){
    update = searchResult.Updates.Item(i);
    for(j = 0; j < update.KBArticleIDs.Count; j++){
      log("found:\t" + update.KBArticleIDs.Item(j));
      if(disabledKBregexp.test(update.KBArticleIDs.Item(j))){
        log("hide:\t" + update.KBArticleIDs.Item(j));
        update.IsHidden = true;
        break;
      }
    }
  }
  log("finish");
  WScript.Quit(0);
  
}catch(e){
  log(e.message);
  WScript.Quit(1);
}

// CScript�Ŏ��s���ꂽ�ꍇ�̂݃��O��\������
function log(message){
  if(/cscript\.exe$/i.test(WScript.FullName)){
    WScript.Echo((new Date()).toLocaleString() + "\t" + message);
  }
}