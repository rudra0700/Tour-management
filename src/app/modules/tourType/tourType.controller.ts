import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TourService } from "./tourType.services";


const createTourType = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await TourService.createTourType(payload);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });
});

const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
    const result = await TourService.getAllTourTypes();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour types retrieved successfully',
        data: result,
    });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const result = await TourService.updateTourType(id as string, payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type updated successfully',
        data: result,
    });
});
const deleteTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TourService.deleteTourType(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type deleted successfully',
        data: result,
    });
});

    export const TourTypeController = {
        createTourType,
        getAllTourTypes,
        updateTourType,
        deleteTourType
    };