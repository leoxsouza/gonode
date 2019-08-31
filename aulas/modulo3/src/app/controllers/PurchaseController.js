const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    const purchase = await Purchase.create({ ...req.body, client: req.userId })

    return res.json(purchase)
  }

  async update (req, res) {
    const purchaseAd = await Purchase.findById(req.params.id)
    const purchasedBy = req.params.id
    const adF = await Ad.findById(purchaseAd.ad)
    adF.purchasedBy = purchasedBy

    const ad = await Ad.findByIdAndUpdate(purchaseAd.ad, adF, {
      new: true
    })

    return res.json(ad)
  }
}

module.exports = new PurchaseController()
