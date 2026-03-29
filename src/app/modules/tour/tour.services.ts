// import { tourSearchFields } from "./tour.constant";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";
import { tourSearchFields } from "./tour.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error("A tour with this title already exists.");
  }

  const tour = await Tour.create(payload);
  return tour;
};

const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const allTours = await queryBuilder
    .search(tourSearchFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    allTours.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

// const getAllTours = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = filter.sort || "-createdAt";
//   const page = Number(filter.page) || 1;
//   const limit = Number(filter.limit) || 5;

//   const skip = (page - 1) * limit;

//   // field filtering
//   const fields = filter.fields?.split(",").join(" ") || "";

//   for (const field of excludeField) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }

//   const searchQuery = {
//     $or: tourSearchFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };

//   const data = await Tour.find(searchQuery)
//     .find(filter)
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit);

//   // Another pattern for all types of query:
//   // const filterQuery = Tour.find(filter);
//   // const tours = filterQuery.find(searchQuery);
//   // const allTours = await tours.sort(sort).select(fields).skip(skip).limit(limit)

//   const totalTour = await Tour.countDocuments();
//   const totalPage = Math.ceil(totalTour / limit);

//   const meta = {
//     page: page,
//     limit: limit,
//     totalTour: totalTour,
//     totalPage: totalPage,
//   };

//   return {
//     data,
//     meta: meta,
//   };
// };

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  if (
    payload.images &&
    payload.images.length > 0 &&
    existingTour.images &&
    existingTour.images.length
  ) {
    payload.images = [...payload.images, ...existingTour.images];
  }

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    const restDBImages = existingTour.images.filter(
      (imageUrl) => !payload.deleteImages?.includes(imageUrl),
    );

    const updatedPayloadImages = (payload.images || [])
      .filter((imageUrl) => !payload.deleteImages?.includes(imageUrl))
      .filter((imageUrl) => !restDBImages.includes(imageUrl));

    payload.images = [...restDBImages, ...updatedPayloadImages];
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
    returnDocuments: "after",
  });

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    await Promise.all(
      payload.deleteImages.map((url) => deleteImageFromCLoudinary(url)),
    );
  }
  return updatedTour;
};

const deleteTour = async (id: string) => {
  return await Tour.findByIdAndDelete(id);
};

export const TourServices = {
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
};
