import React, { useState, useEffect, useRef } from "react";
import Accordion from "react-bootstrap/Accordion";
import { Web3Auth } from "@web3auth/modal";
import { ADAPTER_EVENTS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Modal from "react-bootstrap/Modal";
import upload from "../assets/images/upload (1).svg";
import Header from "./header";
import UploadFile from "./upload";
import Tab from "react-bootstrap/Tab";
import axios from "axios";
import Tabs from "react-bootstrap/Tabs";
import { Formik } from "formik";
import RoyaltyInformationModal from "./royaltyInformation";

import FileIcon from "../assets/images/file.svg";
import FileIconBlack from "../assets/images/file-black.svg";
import ListingIcon from "../assets/images/listing.svg";
import AddIcon from "../assets/images/add.svg";
import ListingWhite from "../assets/images/listing-white.svg";
import AddWhite from "../assets/images/add-white.svg";
import BookIcon from "../assets/images/icons/book.svg";
import StoreIcon from "../assets/images/icons/store.svg";
import CloseIcon from "../assets/images/icons/close-black.svg";

//

import Amazon from "../assets/images/icons/amazon.png";
import Wiley from "../assets/images/wiley.png";
import WooCommerce from "../assets/images/icons/woo-commerce.png";

import SKUIcon from "../assets/images/icons/form/sKU.svg";
import NameIcon from "../assets/images/icons/form/Name.svg";
import DescriptionIcon from "../assets/images/icons/form/Description.svg";
import LinkIcon from "../assets/images/icons/form/Link.svg";
import PrceIcon from "../assets/images/icons/form/Price.svg";
import AuthorIcon from "../assets/images/icons/form/Author.svg";
import EmailIcon from "../assets/images/icons/form/Email.svg";
import UrlIcon from "../assets/images/icons/form/Url.svg";
import ContentIcon from "../assets/images/icons/form/Content.svg";
import TitleIcon from "../assets/images/icons/form/title.svg";
import dragImage from "../assets/images/img-upload.png";
const allStores = [
  {
    id: 1,
    name: "Wiley",
    img: Wiley,
  },
  {
    id: 2,
    name: "Amazon",
    img: Amazon,
  },
  {
    id: 3,
    name: "Woo commerce",
    img: WooCommerce,
  },
];
const Myc2e = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [web3auth, setWeb3auth] = useState(null);
  const [walletConnection, setWalletConneciton] = useState(null);
  const [show, setShow] = useState();
  const [showListing, setShowListing] = useState();
  const [activEpub, setActivEpub] = useState();
  const [activeEpubUrl, setActiveEpubUrl] = useState();
  const [showHide, setShowHide] = useState();
  const [royaltyModal, setRoyaltyModal] = useState();

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.connect();
  };
  const [allData, setAllData] = useState();
  const url = "https://c2e-provider-api.curriki.org";
  const getData = () => {
    fetch(url + "/c2e-media").then((data) =>
      data.json().then((value) => {
        setAllData(value);
      }),
    );
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    (async () => {
      const web3auth = new Web3Auth({
        clientId:
          "BNW0_55WnZZSF6hjmoLGsx2d7NQ_KHuFQnsGOPUPjwWDJAAiT-9iBfu_TeLRkLH3NiKfao04OgEgeCS86JfSFeo",
        chainConfig: {
          chainNamespace: "eip155",
          chainId: "0x1",
        },
      });
      web3auth.on(ADAPTER_EVENTS.CONNECTED, async (data) => {
        console.log("connected to wallet", web3auth);

        const user = await web3auth.getUserInfo();
        setWalletConneciton(user);

        // web3auth.provider will be available here after user is connected
      });
      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log("connecting");
      });
      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log("disconnected");
        setWalletConneciton(null);
      });

      setWeb3auth(web3auth);
      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          network: "testnet",
        },
      });
      web3auth.configureAdapter(openloginAdapter);

      await web3auth.initModal();
    })();
  }, []);

  return (
    <div className="reader-c2e">
      <Header web3auth={web3auth} walletConnection={walletConnection} />

      <div className="reader-main">
        {walletConnection ? (
          <div className="login-text text-detail">
            <h3>How does it work?</h3>
            <p>
              After you have licensed a C2E from a digital marketplace, you will
              receive an email with instructions on how to download it.
              <br />
              Once a copy is downloaded , please navigate to{" "}
              <a
                href="https://c2e-reader.curriki.org"
                target="_blank"
                rel="noreferrer"
              >
                C2E READER.
              </a>
            </p>
          </div>
        ) : (
          <div className="text-detail">
            <h5>Imagine a world…</h5>
            <p>
              … where access to high quality learning resources is equitable,
              affordable, and widely available. <br />
              <br /> … where digital content creators have access to resources
              and incentives to build quality interactive learning experiences,
              and marketplaces where they can get paid fairly for their efforts.
              <br /> <br /> … where the quality and appropriateness of digital
              educational content can be vetted before it enters a marketplace.
            </p>
          </div>
        )}
        <div className="uploadBox">
          <div className="box">
            <h1>Curriki Educational Experiences Writer</h1>
            {walletConnection && (
              <>
                <div className="iconbox">
                  <CircularProgressbarWithChildren value={uploadProgress}>
                    {!!uploadProgress ? (
                      uploadProgress + "%"
                    ) : (
                      <img src={upload} alt="" />
                    )}
                  </CircularProgressbarWithChildren>
                </div>
              </>
            )}

            {walletConnection ? (
              <p className="text">Upload a file from your local device</p>
            ) : (
              <p className="text text-space">Log In and Experience C2Es Now</p>
            )}
            {walletConnection ? (
              <UploadFile
                setUploadProgress={setUploadProgress}
                getData={getData}
              />
            ) : (
              // <form
              //   action="https://writer-dev.curriki.org/upload"
              //   method="post"
              //   enctype="multipart/form-data"
              // >
              //   File to be uploaded:{' '}
              //   <input type="file" name="uploadFile" id="" />
              //   <button type="submit">Upload</button>
              // </form>
              // <FileUploadDownload />
              <button onClick={() => login()}>LET’s GET STARTED!</button>
            )}
          </div>
        </div>
      </div>

      {walletConnection && (
        <Tabs
          defaultActiveKey="profile"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab
            eventKey="profile"
            title={
              <div className="d-flex">
                <img src={FileIcon} alt="file" className="blue-file-icon" />
                <img
                  src={FileIconBlack}
                  alt="file"
                  className="black-file-icon"
                />
                Epub File
              </div>
            }
          >
            <Accordion defaultActiveKey="0">
              {allData
                ?.filter(
                  (data) => data.type === "epub" && data.parentId === null,
                )
                ?.map((value, counter) => {
                  return (
                    <Accordion.Item eventKey={String(counter)}>
                      <Accordion.Header>{value.title}</Accordion.Header>
                      <Accordion.Body>
                        {allData
                          ?.filter(
                            (data1) =>
                              data1.type === "epub" &&
                              data1.parentId === value.id,
                          )
                          ?.map((value1, counter1) => {
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  padding: "10px 0px",
                                  alignItems: "center",
                                  borderBottom: "1px solid #ccc",
                                }}
                              >
                                <div>{value1.title}</div>
                                <div
                                  className=""
                                  style={{
                                    display: "flex",
                                    gap: "12px",
                                  }}
                                >
                                  <button
                                    onClick={() => {
                                      setShowListing(true);
                                      setActivEpub(value1);
                                    }}
                                    class="btn btn-primary sec-btn"
                                  >
                                    <img
                                      src={ListingIcon}
                                      alt="file"
                                      width={20}
                                      height={20}
                                      className="blue-listing-icon"
                                    />
                                    <img
                                      src={ListingWhite}
                                      alt="file"
                                      width={20}
                                      height={20}
                                      className="white-listing-icon"
                                    />
                                    Create Listing
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShow(true);
                                      setActivEpub(value1);
                                    }}
                                    class="btn btn-primary sec-btn"
                                  >
                                    <img
                                      src={AddIcon}
                                      alt="file"
                                      width={14}
                                      height={14}
                                      className="blue-add-icon"
                                    />
                                    <img
                                      src={AddWhite}
                                      alt="file"
                                      width={14}
                                      height={14}
                                      className="white-add-icon"
                                    />
                                    Create C2E
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
            </Accordion>
          </Tab>
          <Tab
            eventKey="contact"
            title={
              <div className="d-flex">
                <img src={FileIcon} alt="file" className="blue-file-icon" />
                <img
                  src={FileIconBlack}
                  alt="file"
                  className="black-file-icon"
                />
                CurrikiStudio File
              </div>
            }
          >
            {allData
              ?.filter((data) => data.type !== "epub")
              ?.map((value) => {
                return <div>{value.title}</div>;
              })}
          </Tab>
        </Tabs>
      )}

      <ListingModule
        showListing={showListing}
        setShowListing={setShowListing}
        activEpub={activEpub}
        allData={allData}
        user={walletConnection}
        setRoyaltyModal={setRoyaltyModal}
      />

      <RoyaltyInformationModal show={royaltyModal} setShow={setRoyaltyModal} />

      {/* <HiddenModule showListing={showHide} setShowListing={setShowHide} /> */}
    </div>
  );
};

export default Myc2e;

const ListingModule = ({
  showListing,
  setShowListing,
  setRoyaltyModal,
  activEpub,
  allData,
  user,
}) => {
  const [steps, setSteps] = useState(1);
  const [selectedStore, setSelectedStore] = useState();
  console.log(user);

  return (
    <Modal
      show={showListing}
      onHide={() => {
        setShowListing(false);
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="right-aligned-modal"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body>
        <div className="uploadBox modial-iner-box">
          <button
            type="button"
            onClick={() => setShowListing(false)}
            className="close-btn"
          >
            <img src={CloseIcon} alt="close" />
          </button>
          <div className="list-steps">
            <div className="step">
              <h5 className="">Select</h5>
            </div>
            <div className={`step ${steps === 1 && "disable"}`}>
              <h5 className="">Describe</h5>
            </div>
          </div>
          <br />
          <div className="modal-title-heading">
            <h1>
              <img src={StoreIcon} alt="store" /> {selectedStore?.name}
            </h1>
            <h2>{activEpub?.title}</h2>
            <h3>
              <img src={BookIcon} alt="book" />
              {
                allData?.filter((data) => data.id === activEpub?.parentId)?.[0]
                  ?.title
              }
            </h3>
          </div>

          {steps === 1 ? (
            <div className="e-commerce-stor">
              <div className="selection-stor-box mb-5">
                {allStores?.map((data) => {
                  return (
                    <div
                      className="box"
                      onClick={() => {
                        setSteps(2);
                        setSelectedStore(data);
                      }}
                    >
                      <img src={data.img} alt="" />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : steps === 2 ? (
            <div>
              <Formik
                initialValues={{
                  c2eTitle: activEpub?.title,
                  sku: activEpub?.identifier,
                  price: "",
                  c2eDiscription: "",
                  ownerName: user?.name,
                  ownerEmail: user?.email,
                  ownerLicense: "",
                  url: "",
                  publisherName: "Curriki",
                  publisherEmail: "publisher@curriki.org",
                  publisherUrl: "https://curriki.org",
                  copyrightTitle: "",
                  copyrightDiscription: "",
                  copyrightYear: "",
                  usageType: ["Purchased"],
                }}
                enableReinitialize
                validate={(values) => {
                  const errors = {};
                  if (!values.price) {
                    errors.price = "Required";
                  }
                  if (!values.url) {
                    errors.url = "Required";
                  }

                  if (!values.copyrightTitle) {
                    errors.copyrightTitle = "Required";
                  }

                  return errors;
                }}
                onSubmit={(values) => {
                  // try {
                  //   const response = await axios.post(
                  //     "https://c2e-reader.curriki.org/c2e/list/media",
                  //     values,
                  //   );
                  //   console.log(response.data);
                  // } catch (error) {
                  //   console.error(error);
                  // }
                  console.log("values", values);
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  /* and other goodies */
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="formik-box">
                      <div className="stor-flex-box">
                        <h5>C2E Details</h5>

                        <div className="input-box">
                          <label>
                            <img src={SKUIcon} alt="aku" /> ISBN
                          </label>
                          <input
                            type="text"
                            name="sku"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.sku}
                          />
                        </div>

                        <div className="input-box">
                          <label>
                            <img src={NameIcon} alt="name" /> C2E Title *
                          </label>
                          <input
                            type="text"
                            name="c2eTitle"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.c2eTitle}
                          />
                          <p className="error">
                            {errors.c2eTitle &&
                              touched.c2eTitle &&
                              errors.c2eTitle}
                          </p>
                        </div>

                        <div className="input-box">
                          <label>
                            <img src={DescriptionIcon} alt="DescriptionIcon" />
                            C2E Description
                          </label>
                          <textarea
                            type="text"
                            name="c2eDiscription"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.c2eDiscription}
                          />
                        </div>
                      </div>
                      <div className="stor-flex-box">
                        <h5>Copyright Owner Details</h5>

                        <div className="input-box">
                          <label>
                            <img src={NameIcon} alt="neme" /> Name
                          </label>
                          <input
                            type="text"
                            name="ownerName"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.ownerName}
                            readOnly
                          />
                        </div>

                        <div className="input-box">
                          <label>
                            <img src={EmailIcon} alt="email" /> Email
                          </label>
                          <input
                            type="email"
                            name="ownerEmail"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.ownerEmail}
                            readOnly
                          />
                        </div>

                        <div className="input-box">
                          <label>
                            <img src={UrlIcon} alt="pub" /> URL
                          </label>
                          <input
                            type="text"
                            name="url"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.url}
                          />
                          <p className="error">
                            {errors.url && touched.url && errors.url}
                          </p>
                        </div>

                        <div className="input-box">
                          <label>
                            <img src={PrceIcon} alt="" /> Price ($USD) *
                          </label>
                          <input
                            type="number"
                            name="price"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.price}
                          />
                          <p className="error">
                            {errors.price && touched.price && errors.price}
                          </p>
                        </div>
                        <div className="input-box">
                          <label>
                            <img src={TitleIcon} alt="title" /> License Terms
                          </label>
                          <input
                            type="text"
                            name="ownerLicense"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.ownerLicense}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="formik-box">
                      <div className="stor-flex-box">
                        <h5>C2E License Details</h5>
                        <div className="input-box">
                          <label>Set Usage Type</label>
                        </div>

                        <div className="d-flex check-box">
                          <div className="check">
                            <input
                              type="radio"
                              name="usageType"
                              value="Purchased"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              checked={values.usageType.includes("Purchased")}
                            />
                            <label className="ml-2">Purchased</label>
                          </div>
                          <div className="check">
                            <input
                              type="radio"
                              name="usageType"
                              value="Subscription"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              checked={values.usageType.includes(
                                "Subscription",
                              )}
                            />
                            <label className="ml-2">Subscription</label>
                          </div>
                          <div className="check">
                            <input
                              type="radio"
                              name="usageType"
                              value="Open"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              checked={values.usageType.includes("Open")}
                            />
                            <label className="ml-2">Open</label>
                          </div>
                        </div>
                        <div className="input-box">
                          <label>
                            <img src={TitleIcon} alt="title" /> Copyright Title
                          </label>
                          <input
                            type="text"
                            name="copyrightTitle"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.copyrightTitle}
                          />
                          <p className="error">
                            {errors.copyrightTitle &&
                              touched.copyrightTitle &&
                              errors.copyrightTitle}
                          </p>
                        </div>

                        <div className="input-box">
                          <label>
                            <img src={DescriptionIcon} alt="DescriptionIcon" />
                            Copyright Description
                          </label>
                          <textarea
                            type="text"
                            name="copyrightDiscription"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.copyrightDiscription}
                          />
                        </div>

                        <div className="input-box">
                          <label>
                            <img src={TitleIcon} alt="title" /> Copyright Year
                          </label>
                          <input
                            type="text"
                            name="copyrightYear"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.copyrightYear}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "32px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setRoyaltyModal(true)}
                            className="btn btn-primary sec-btn"
                          >
                            Royalty Information
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary sec-btn"
                          >
                            Additional Information
                          </button>
                        </div>
                      </div>

                      <div className="stor-flex-box">
                        <h5>Publisher Details</h5>

                        <div className="input-box">
                          <label>
                            <img src={NameIcon} alt="neme" /> Name
                          </label>
                          <input
                            type="text"
                            name="publisherName"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.publisherName}
                            readOnly
                          />
                        </div>

                        <div className="input-box">
                          <label>
                            <img src={EmailIcon} alt="email" /> Email
                          </label>
                          <input
                            type="email"
                            name="publisherEmail"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.publisherEmail}
                            readOnly
                          />
                        </div>

                        <div className="input-box">
                          <label>
                            <img src={UrlIcon} alt="pub" /> URL
                          </label>
                          <input
                            type="text"
                            name="publisherUrl"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.publisherUrl}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    {steps === 2 && (
                      <div className="form-btn">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary "
                          // onClick={() => {
                          //   if (

                          //     values.price !== "" &&
                          //     values.url !== "" &&
                          //     values.copyrightTitle !== ""
                          //   ) {
                          //     setSteps(3);
                          //   }
                          // }}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </Formik>
            </div>
          ) : (
            steps === 3 && (
              <div className="w-100 ">
                <h3 className="product-heading text-center mt-5">
                  Thank You For Submition
                </h3>
              </div>
            )
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {steps !== 1 && (
          <button
            onClick={() => {
              if (steps === 1) {
                setSteps(2);
              } else if (steps === 2) {
                setSteps(1);
              } else if (steps === 3) {
                setSteps(2);
              }
            }}
            type="button"
            className="btn btn-primary"
          >
            Back
          </button>
        )}
        {steps === 3 && (
          <button
            onClick={() => {
              setShowListing(false);
            }}
            type="button"
            className="btn btn-secondary"
          >
            Close
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

// const HiddenModule = ({ showListing, setShowListing }) => {
//   const [steps, setSteps] = useState(1);
//   const inputFileRef = useRef(null);
//   const [selectedImages, setSelectedImages] = useState([]);

//   const handleImageChange = (event) => {
//     const files = event.target.files;
//     const updatedImages = [...selectedImages];

//     for (let i = 0; i < files.length; i++) {
//       updatedImages.push(files[i]);
//     }

//     setSelectedImages(updatedImages);
//   };

//   const handleUpload = () => {
//     inputFileRef.current.click();
//     // setSelectedImages([]);
//   };

//   const handleImageDelete = (index) => {
//     const newImages = [...selectedImages];
//     newImages.splice(index, 1);
//     setSelectedImages(newImages);
//   };

//   return (
//     <Modal
//       show={showListing}
//       onHide={() => {
//         setShowListing(false);
//       }}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       dialogClassName="right-aligned-modal"
//       centered
//       backdrop="static"
//       keyboard={false}
//     >
//       <Modal.Header closeButton>
//         <div className="list-steps">
//           <div className="step">
//             <h5 className="">Select</h5>
//           </div>
//           <div className={`step ${steps === 1 && "disable"}`}>
//             <h5 className="">Describe</h5>
//           </div>
//           <div
//             className={`step ${steps === 1 || steps === 2 ? "disable" : ""}`}
//           >
//             <h5 className="">Finish</h5>
//           </div>
//         </div>
//       </Modal.Header>
//       <Modal.Body>
//         <div className="uploadBox modial-iner-box">
//           {steps === 1 ? (
//             <div className="e-commerce-stor">
//               <div className="selection-stor-box mb-5">
//                 <div
//                   className="box"
//                   onClick={() => {
//                     setSteps(2);
//                   }}
//                 >
//                   <img src={AliBaba} alt="" />
//                 </div>
//                 <div
//                   className="box"
//                   onClick={() => {
//                     setSteps(2);
//                   }}
//                 >
//                   <img src={Amazon} alt="" />
//                 </div>
//                 <div
//                   className="box"
//                   onClick={() => {
//                     setSteps(2);
//                   }}
//                 >
//                   <img src={Daraz} alt="" />
//                 </div>
//                 <div
//                   className="box"
//                   onClick={() => {
//                     setSteps(2);
//                   }}
//                 >
//                   <img src={Ebay} alt="" />
//                 </div>
//                 <div
//                   className="box"
//                   onClick={() => {
//                     setSteps(2);
//                   }}
//                 >
//                   <img src={WooCommerce} alt="" />
//                 </div>
//               </div>
//             </div>
//           ) : steps === 2 ? (
//             <div>
//               <Formik
//                 initialValues={{
//                   productName: "",
//                   sku: "",
//                   price: "",
//                   productDiscription: "",
//                   title: "",
//                   name: "",
//                   email: "",
//                   url: "",
//                   C2Elink: "",
//                   C2EAuthor: "",
//                   C2EContentType: "",
//                   copyrightTitle: "",
//                   copyrightDiscription: "",
//                   copyrightYear: "",
//                   toppings: [],
//                 }}
//                 validate={(values) => {
//                   const errors = {};
//                   if (!values.productName) {
//                     errors.productName = "Required";
//                   }
//                   if (!values.price) {
//                     errors.price = "Required";
//                   }
//                   if (!values.productDiscription) {
//                     errors.productDiscription = "Required";
//                   }
//                   if (!values.url) {
//                     errors.url = "Required";
//                   }

//                   if (!values.title) {
//                     errors.title = "Required";
//                   }

//                   if (!values.name) {
//                     errors.name = "Required";
//                   }
//                   if (!values.email) {
//                     errors.email = "Required";
//                   } else if (
//                     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
//                       values.email,
//                     )
//                   ) {
//                     errors.email = "Invalid email address";
//                   }
//                   return errors;
//                 }}
//                 onSubmit={(values, { setSubmitting }) => {
//                   setTimeout(() => {
//                     console.log("login", values);
//                     alert(JSON.stringify(values, null, 2));
//                     setSubmitting(false);
//                   }, 400);
//                 }}
//               >
//                 {({
//                   values,
//                   errors,
//                   touched,
//                   handleChange,
//                   handleBlur,
//                   handleSubmit,
//                   isSubmitting,
//                   /* and other goodies */
//                 }) => (
//                   <form onSubmit={handleSubmit} className="formik-box">
//                     <div className="stor-flex-box">
//                       <h5>Store Information</h5>
//                       <p>
//                         Lorem Ipsum is simply dummy text of the printing and
//                         typesetting industry.
//                       </p>
//                       <br />

//                       <div className="input-box">
//                         <label>
//                           <img src={SKUIcon} alt="aku" /> SKU
//                         </label>
//                         <input
//                           type="text"
//                           name="sku"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.sku}
//                         />
//                       </div>

//                       <div className="input-box">
//                         <label>
//                           <img src={NameIcon} alt="name" /> Name *
//                         </label>
//                         <input
//                           type="text"
//                           name="productName"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.productName}
//                         />
//                         <p className="error">
//                           {errors.productName &&
//                             touched.productName &&
//                             errors.productName}
//                         </p>
//                       </div>

//                       <div className="input-box">
//                         <label>
//                           <img src={PrceIcon} alt="" /> Price ($USD) *
//                         </label>
//                         <input
//                           type="number"
//                           name="price"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.price}
//                         />
//                         <p className="error">
//                           {errors.price && touched.price && errors.price}
//                         </p>
//                       </div>

//                       <div className="input-box">
//                         <label>
//                           <img src={DescriptionIcon} alt="DescriptionIcon" />
//                           Description
//                         </label>
//                         <textarea
//                           type="text"
//                           name="productDiscription"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.productDiscription}
//                         />
//                       </div>
//                       {/* second */}

//                       {/* <div className="input-box">
//                         <label>
//                           <img src={LinkIcon} alt="LinkIcon" /> C2E link
//                         </label>
//                         <input
//                           type="text"
//                           name="C2Elink"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.C2Elink}
//                         />
//                       </div> */}

//                       <div className="input-box">
//                         <label>
//                           <img src={LinkIcon} alt="LinkIcon" /> Uplaod images
//                         </label>

//                         <div className="curriki-image-update-util">
//                           <div className="box-section">
//                             <div className="overlay">
//                               <img
//                                 className="overlay-drag-image"
//                                 src={dragImage}
//                                 alt="drag"
//                               />
//                               <div className="img-button">
//                                 <input
//                                   type="file"
//                                   multiple
//                                   accept="image/*"
//                                   ref={inputFileRef}
//                                   style={{ display: "none" }}
//                                   onChange={handleImageChange}
//                                 />
//                                 <buttun
//                                   type="button"
//                                   className="overlay-drag-brows-btn"
//                                   onClick={handleUpload}
//                                 >
//                                   Upload Images
//                                 </buttun>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="">
//                           {selectedImages && (
//                             <div>
//                               <p>Uploaded Images</p>
//                               <div className="uploaded-image">
//                                 {selectedImages.map((image, index) => (
//                                   <img
//                                     key={index}
//                                     src={URL.createObjectURL(image)}
//                                     alt={`Image ${index}`}
//                                     onClick={() => handleImageDelete(index)}
//                                     style={{
//                                       maxWidth: "100px",
//                                       width: "100%",
//                                       height: "100px",
//                                       objectFit: "cover",
//                                     }}
//                                   />
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="input-box">
//                         <label>
//                           <img src={AuthorIcon} alt="author" /> C2E author
//                         </label>
//                         <input
//                           type="text"
//                           name="C2EAuthor"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.C2EAuthor}
//                         />
//                       </div>

//                       <div className="input-box">
//                         <label>
//                           <img src={ContentIcon} alt="cntent" /> C2E Content
//                           Type
//                         </label>
//                         <input
//                           type="text"
//                           name="C2EContentType"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.C2EContentType}
//                         />
//                       </div>
//                     </div>

//                     <div className="stor-flex-box">
//                       <h5>C2E License Details</h5>
//                       <p>
//                         Lorem Ipsum is simply dummy text of the printing and
//                         typesetting industry.
//                       </p>
//                       <br />

//                       <div className="input-box">
//                         <label>Set Usage Type</label>
//                       </div>

//                       <div className="d-flex check-box">
//                         <div className="check">
//                           <input
//                             type="checkbox"
//                             name="toppings"
//                             value="Purchased"
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             checked={values.toppings.includes("Purchased")}
//                           />
//                           <label className="ml-2">Purchased</label>
//                         </div>
//                         <div className="check">
//                           <input
//                             type="checkbox"
//                             name="toppings"
//                             value="Subscription"
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             checked={values.toppings.includes("Subscription")}
//                           />
//                           <label className="ml-2">Subscription</label>
//                         </div>
//                         <div className="check">
//                           <input
//                             type="checkbox"
//                             name="toppings"
//                             value="Open"
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             checked={values.toppings.includes("Open")}
//                           />
//                           <label className="ml-2">Open</label>
//                         </div>
//                       </div>
//                       <div className="input-box">
//                         <label>
//                           <img src={TitleIcon} alt="title" /> Copyright Title
//                         </label>
//                         <input
//                           type="text"
//                           name="copyrightTitle"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.title}
//                         />
//                         <p className="error">
//                           {errors.copyrightTitle &&
//                             touched.copyrightTitle &&
//                             errors.copyrightTitle}
//                         </p>
//                       </div>

//                       <div className="input-box">
//                         <label>
//                           <img src={DescriptionIcon} alt="DescriptionIcon" />
//                           Copyright Description
//                         </label>
//                         <textarea
//                           type="text"
//                           name="copyrightDiscription"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.copyrightDiscription}
//                         />
//                         <p className="error">
//                           {errors.copyrightDiscription &&
//                             touched.copyrightDiscription &&
//                             errors.copyrightDiscription}
//                         </p>
//                       </div>

//                       <div className="input-box">
//                         <label>
//                           <img src={TitleIcon} alt="title" /> Copyright Year
//                         </label>
//                         <input
//                           type="text"
//                           name="copyrightYear"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.title}
//                         />
//                         <p className="error">
//                           {errors.copyrightYear &&
//                             touched.copyrightYear &&
//                             errors.copyrightYear}
//                         </p>
//                       </div>

//                       <div className="license-card-box">
//                         <div className="lic-cards">
//                           <div className="c2e-linc-card">
//                             <p>Financial Year 2023 Chart</p>
//                             <div
//                               className="lic-bg-image"
//                               style={{
//                                 backgroundImage: `url(${""})`,
//                                 backgroundRepeat: "no-repeat",
//                                 backgroundSize: "cover",
//                                 backgroundPosition: "center",
//                               }}
//                             />
//                             <h4>Terms $10/year Unlimited </h4>
//                           </div>
//                         </div>
//                         <div className="lic-cards">
//                           <div className="c2e-linc-card">
//                             <p>Financial Year 2023 Chart</p>
//                             <div
//                               className="lic-bg-image"
//                               style={{
//                                 backgroundImage: `url(${""})`,
//                                 backgroundRepeat: "no-repeat",
//                                 backgroundSize: "cover",
//                                 backgroundPosition: "center",
//                               }}
//                             />
//                             <h4>Terms $10/year Unlimited </h4>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="stor-flex-box">
//                       <h5>Owner Information</h5>
//                       <p>
//                         Lorem Ipsum is simply dummy text of the printing and
//                         typesetting industry.
//                       </p>
//                       <br />
//                       <div className="input-box">
//                         <label>
//                           <img src={TitleIcon} alt="title" /> Title
//                         </label>
//                         <input
//                           type="text"
//                           name="title"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.title}
//                         />
//                         <p className="error">
//                           {errors.title && touched.title && errors.title}
//                         </p>
//                       </div>

//                       <div className="input-box">
//                         <label>
//                           <img src={NameIcon} alt="neme" /> Name
//                         </label>
//                         <input
//                           type="text"
//                           name="name"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.name}
//                         />
//                         <p className="error">
//                           {errors.name && touched.name && errors.name}
//                         </p>
//                       </div>

//                       <div className="input-box">
//                         <label>
//                           <img src={EmailIcon} alt="email" /> Email
//                         </label>
//                         <input
//                           type="email"
//                           name="email"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.email}
//                         />
//                         <p className="error">
//                           {errors.email && touched.email && errors.email}
//                         </p>
//                       </div>

//                       <div className="input-box">
//                         <label>
//                           <img src={UrlIcon} alt="pub" /> Publisher URL
//                         </label>
//                         <input
//                           type="text"
//                           name="url"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.url}
//                         />
//                         <p className="error">
//                           {errors.url && touched.url && errors.url}
//                         </p>
//                       </div>
//                     </div>
//                     {/*
//                      */}

//                     {steps === 2 && (
//                       <div className="form-btn">
//                         <button
//                           type="submit"
//                           disabled={isSubmitting}
//                           className="btn btn-primary "
//                           onClick={() => {
//                             if (
//                               values.productName !== "" ||
//                               values.price !== "" ||
//                               values.title !== "" ||
//                               values.name !== "" ||
//                               values.email !== ""
//                             ) {
//                               setSteps(3);
//                             }
//                           }}
//                         >
//                           Submit
//                         </button>
//                       </div>
//                     )}
//                   </form>
//                 )}
//               </Formik>
//             </div>
//           ) : (
//             steps === 3 && (
//               <div className="w-100 ">
//                 <h3 className="product-heading text-center mt-5">
//                   Thank You For Submition
//                 </h3>
//               </div>
//             )
//           )}
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         {steps !== 1 && (
//           <button
//             onClick={() => {
//               if (steps === 1) {
//                 setSteps(2);
//               } else if (steps === 2) {
//                 setSteps(1);
//               } else if (steps === 3) {
//                 setSteps(2);
//               }
//             }}
//             type="button"
//             className="btn btn-primary"
//           >
//             Back
//           </button>
//         )}
//         {steps === 3 && (
//           <button
//             onClick={() => {
//               setShowListing(false);
//             }}
//             type="button"
//             className="btn btn-secondary"
//           >
//             Close
//           </button>
//         )}
//       </Modal.Footer>
//     </Modal>
//   );
// };
