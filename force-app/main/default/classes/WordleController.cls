public without sharing class WordleController {

    @AuraEnabled
    //aura enabled method returns a promise so can be used in async await
    public static boolean isWordValid(String word) {
        CalloutManager.ResponseWrapper response = CalloutManager.doGet('https://api.dictionaryapi.dev/api/v2/entries/en/' + word, 'GET');
        System.debug('##res='+response);
        if(response.statusCode == 200) 
            return true;
        else 
            return false;
    }
    
    //@AuraEnabled
    //aura enabled method returns a promise so can be used in async await
    //Using CSP Trusted Sites for this callout
    public static String generateRandomWord() {
        CalloutManager.ResponseWrapper response = CalloutManager.doGet('https://random-word-api.herokuapp.com/word?lang=en&number=1&length=5', 'GET');
    	return response.responseString.replace('["','').replace('"]','');
    }
}