const Listing = require("../models/listing");
const User = require("../models/user");
const Reservation = require("../models/reservation");

module.exports.destroyReservation = async(req,res)=>{
    let reservationId = req.params;//object
    let {userId} = req.body;
    await User.findByIdAndUpdate(userId,{$pull:{Reservations:reservationId.id}})
    await Reservation.findByIdAndDelete(reservationId.id);
    req.flash("success","Reservation deleted");
    res.redirect("/wanderstay/listings");
}
module.exports.createReservation = async(req,res)=>{
    let {checkin,checkout,finalPrice,listingId,guests} = req.body;
    let listing = Listing.findById(listingId);
    if(!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/wanderstay/listings");
    }
    let newReservation = new Reservation({
    author :req.user._id,
    listing : listingId,
    price : finalPrice,
    checkIn :  checkin,
    checkOut : checkout,
    guest : guests
    })
    await newReservation.save();
    let user = await User.findById(req.user._id);
    if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/wanderstay/listings");
    }
    if (!user.Reservations) {
        user.Reservations = [];
    }
    user.Reservations.push(newReservation._id);
    await user.save();
    req.flash("success","New Reservation created");
    res.redirect('/wanderstay/listings');
    }
    module.exports.showReservation = async(req,res)=>{
    let userId = req.user._id;
    const user = await User.findOne({ _id: userId })
        .populate({
            path: 'Reservations',
            populate: { path: 'listing' }  // Populate the listing field within each Reservation
        });
    if(user.Reservations.length==0){
    req.flash("error","No Reservation found");
    res.redirect('/wanderstay/listings');
    }
    res.render('listings/reservation.ejs',{ reservations: user.Reservations, user: user});
}
