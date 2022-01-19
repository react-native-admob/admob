class RNAdMobAdHolder<T> {
    private var adArrayQueue = DispatchQueue(label: "RNAdMobAdHolderQueue")
    private var adArray = Dictionary<Int, T>()
    
    func add(requestId: Int, ad: T) {
        adArrayQueue.sync {
            adArray.updateValue(ad, forKey: requestId)
        }
    }
    
    func get(requestId: Int) -> T? {
        adArrayQueue.sync {
            return adArray[requestId]
        }
    }
    
    func remove(requestId: Int) {
        adArrayQueue.sync {
            adArray.removeValue(forKey: requestId)
        }
    }
    
    func clear() {
        adArrayQueue.async(flags: .barrier) {[weak self] in
            self?.adArray.removeAll()
        }
    }
}
