const Gallery = ({ images }) => {
  if (!images || images.length === 0) {
    return (
      <section id="gallery" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
            Ghosti Gallery
          </h2>
          <div className="text-center text-gray-400">
            <p>No Ghostis generated yet. Create your first one above!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
          Ghosti Gallery
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((item, index) => (
            <div
              key={item.timestamp || index}
              className="group bg-[#1a1b1e] rounded-xl overflow-hidden border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer"
            >
              <div className="aspect-square bg-[#25262a] relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = '/base.png';
                  }}
                />
              </div>
              <div className="p-3">
                <p className="text-sm text-gray-400 truncate" title={item.prompt}>
                  {item.prompt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
