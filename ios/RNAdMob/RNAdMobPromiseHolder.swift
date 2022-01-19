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
    
    func reject(requestId: Int, errorData: Dictionary<String, Any>) {
        let rejectBlock = rejectArray[requestId]
        if (rejectBlock != nil) {
            let error = NSError.init(domain: "com.rnadmob.admob", code: 0, userInfo: errorData)
            rejectBlock!(kEventAdFailedToPresent, "Error occurred while showing ad.", error)
        }
        resolveArray.removeValue(forKey: requestId)
        rejectArray.removeValue(forKey: requestId)
    }
}
