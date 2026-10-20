import express from 'express'
import contactCtrl from '../controllers/contact.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

// Anyone can submit the contact form; reading/managing messages requires sign in
router.route('/api/contacts')
  .get(authCtrl.requireSignin, contactCtrl.list)
  .post(contactCtrl.create)
  .delete(authCtrl.requireSignin, contactCtrl.removeAll)

router.route('/api/contacts/:contactId')
  .get(authCtrl.requireSignin, contactCtrl.read)
  .put(authCtrl.requireSignin, contactCtrl.update)
  .delete(authCtrl.requireSignin, contactCtrl.remove)

router.param('contactId', contactCtrl.contactByID)

export default router
