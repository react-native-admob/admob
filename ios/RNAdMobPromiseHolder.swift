import React

class RNAdMobPromiseHolder {
    private var resolveArray = Dictionary<Int, RCTPromiseResolveBlock>()
    private var rejectArray = Dictionary<Int, RCTPromiseRejectBlock>()
    
    func add(requestId: Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        resolveArray.updateValue(resolve, forKey: requestId)
        rejectArray.updateValue(reject, forKey: requestId)
    }
    
    func clear() {
        resolveArray.removeAll()
        rejectArray.removeAll()
    }
    
    func resolve(requestId: Int) {
        let resolveBlock = resolveArray[requestId]
        if (resolveBlock != nil) {
            resolveBlock!(nil)
        }
        resolveArray.removeValue(forKey: requestId)
        rejectArray.removeValue(forKey: requestId)
    }
    
    func reject(requestId: Int, error: Error) {
        let rejectBlock = rejectArray[requestId]
        if (rejectBlock != nil) {
            let code = String.localizedStringWithFormat("E_AD_PRESENT_FAILED(%d)", (error as NSError).code)
            rejectBlock!(code, error.localizedDescription, error)
        }
        resolveArray.removeValue(forKey: requestId)
        rejectArray.removeValue(forKey: requestId)
    }
    
    func reject(requestId: Int, code: String, message: String) {
        let rejectBlock = rejectArray[requestId]
        if (rejectBlock != nil) {
            rejectBlock!(code, message, nil)
        }
        resolveArray.removeValue(forKey: requestId)
        rejectArray.removeValue(forKey: requestId)
    }
}
