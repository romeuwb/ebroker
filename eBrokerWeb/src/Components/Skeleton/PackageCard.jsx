import Skeleton from 'react-loading-skeleton'

const PackageCard = () => {
  return (
    <div className="package_content">
      <div className="package_image">
        <Skeleton height={150} width={150} />
      </div>
      <div className="package_title">
        <Skeleton width={100} />
      </div>
      <div className="package_line"></div>
      <div className="package_cat_title">
        <Skeleton width={100} />
        <Skeleton width={100} />
        <Skeleton width={20} height={20} />
      </div>
    </div>
  );
};

export default PackageCard;
