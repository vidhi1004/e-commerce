"use client";

interface Image {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

interface ImageTableProps {
  images: Image[];
  onEdit: (image: Image) => void;
}

function ImageTable({ images, onEdit }: ImageTableProps) {
  return (
    <div className="relative overflow-x-auto border-2 border-gray-400 shadow-gray-400 rounded-lg p-6 shadow-md">
      <table className="w-full text-sm text-left shadow-xl shadow-olive-400">
        <thead className="bg-gray-200 shadow-md">
          <tr>
            <th className="px-6 py-3">Preview</th>
            <th className="px-6 py-3">Image URL</th>
            <th className="px-6 py-3">Primary</th>
            <th className="px-6 py-3">Display Order</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {images.map((image) => (
            <tr
              key={image.id}
              className="border border-gray-200 hover:bg-gray-300"
            >
              <td className="px-6 py-4">
                <img
                  src={image.imageUrl}
                  alt="Product"
                  className="w-16 h-16 object-cover rounded"
                />
              </td>

              <td className="px-6 py-4 break-all">{image.imageUrl}</td>

              <td className="px-6 py-4">{image.isPrimary ? "Yes" : "No"}</td>

              <td className="px-6 py-4">{image.displayOrder}</td>

              <td className="px-6 py-4">
                <button
                  onClick={() => onEdit(image)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ImageTable;
