const OfferService = require('../../services/OfferService');
const CreateOfferDTO = require('../../mappers/dtos/CreateOfferDTO');

class OfferController {
    async createOffer(req, res) {
        try {
            const offerDTO = new CreateOfferDTO(req.body);
            const validation = offerDTO.validate();

            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: validation.errors
                });
            }

            const offer = await OfferService.createOffer(offerDTO, req.user.userId);

            res.status(201).json({
                success: true,
                message: 'Offer submitted successfully',
                offer
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    async getOffer(req, res) {
        try {
            const { id } = req.params;
            const offer = await OfferService.getOfferById(id, req.user?.userId);

            if (!offer) {
                return res.status(404).json({ 
                    error: 'Offer not found' 
                });
            }

            res.status(200).json({
                success: true,
                offer,
                is_sealed: offer.is_sealed || false
            });
        } catch (error) {
            res.status(500).json({ 
                error: error.message 
            });
        }
    }

    async getOffersByTender(req, res) {
        try {
            const { tenderId } = req.params;
            const result = await OfferService.getOffersByTender(
                tenderId, 
                req.user?.userId
            );

            // إذا كانت العروض مختومة (قبل تاريخ الفتح)
            if (result.is_sealed) {
                return res.status(200).json({
                    success: true,
                    is_sealed: true,
                    total_offers: result.total_offers,
                    opening_date: result.opening_date,
                    message: result.message
                });
            }

            // بعد تاريخ الفتح
            res.status(200).json({
                success: true,
                is_sealed: false,
                count: result.total_offers,
                offers: result.offers
            });
        } catch (error) {
            res.status(500).json({ 
                error: error.message 
            });
        }
    }

    async getMyOffers(req, res) {
        try {
            const offers = await OfferService.getOffersBySupplier(req.user.userId);

            res.status(200).json({
                success: true,
                count: offers.length,
                offers
            });
        } catch (error) {
            res.status(500).json({ 
                error: error.message 
            });
        }
    }

    async evaluateOffer(req, res) {
        try {
            const { id } = req.params;
            const { score, notes } = req.body;

            if (!score) {
                return res.status(400).json({ 
                    error: 'Evaluation score is required' 
                });
            }

            const offer = await OfferService.evaluateOffer(
                id, 
                { score, notes }, 
                req.user.userId
            );

            res.status(200).json({
                success: true,
                message: 'Offer evaluated successfully',
                offer
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    async selectWinner(req, res) {
        try {
            const { id } = req.params;
            
            const offer = await OfferService.selectWinningOffer(id, req.user.userId);

            res.status(200).json({
                success: true,
                message: 'Winning offer selected successfully',
                offer
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    async rejectOffer(req, res) {
        try {
            const { id } = req.params;
            
            const offer = await OfferService.rejectOffer(id, req.user.userId);

            res.status(200).json({
                success: true,
                message: 'Offer rejected successfully',
                offer
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }
}

module.exports = new OfferController();
