class RNAdMobAdHolder<T> {
    private var adArray = Dictionary<Int, T>()
    
    func add(requestId: Int, ad: T) {
        adArray.updateValue(ad, forKey: requestId)
    }
    
    func get(requestId: Int) -> T? {
        return adArray[requestId]
    }
    
    func remove(requestId: Int) {
        adArray.removeValue(forKey: requestId)
    }
    
    func clear() {
        adArray.removeAll()
    }
}
