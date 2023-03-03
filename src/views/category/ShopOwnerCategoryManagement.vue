<template>
<!--  Shop-->
  <AdminSidebar>
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modalMessage="modalMessage" @close-modal="closeInfoModal"/>

    <confirm-dialog :modalMessage="modalMessage" v-if="confirmActive" @confirm="confirm" v-on:cancel="cancel"/>
    <div class="col-12">


      <div class="d-flex align-items-center">
        <button @click="$router.back()" style="color: var(--text-color);" class=" btn fs-5"><i class="fas fa-chevron-left"> </i>
        </button>
        <span class="fs-3 p-1">{{ $t('message.categories_management') }}</span>
      </div>

      <div class="row border-end border-1">


        <!--          Category-->
        <div class="col-12 col-md-3 mb-3">
          <div class="p-2" style="background-color: var(--light);border-radius: var(--border-radius);">
            <div class="card-body p-2">
              <form @submit.prevent="upload">
                <div class="d-flex ">
                  <div class="form-floating w-100">
                    <input type="text" required class="form-control" v-model="category.name" id="category-name" placeholder="enter category name">
                    <label for="barcode-input">{{ $t('message.category_name') }}</label>
                  </div>
                  <button type="submit" class="btn ms-2 text-nowrap" style="background-color: var(--btnLight);"><i class="fas fa-circle-plus"></i> Add</button>
                </div>
              </form>
            </div>


            <div class="table-responsive table-box">
              <table class="table table-hover table-striped">
                <tbody>
                <tr v-for="(category, index) in filterCategories" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{category.name}}</td>
                  <td class="text-end">
                    <button class="btn btn-outline-danger btn-sm me-1" @click="deleteCategory(category)" v-if="category.name!=='All'"><i class="fas fa-trash"></i></button>
                    <button type="button" class="btn btn-outline-warning btn-sm mx-1" @click="openEditBox(category)" v-if="category.name!=='All'" data-bs-toggle="modal" data-bs-target="#liveCountModal">
                      <i class="fas fa-edit"></i>
                    </button>

                    <div class="modal fade" style="z-index: 10000;" id="liveCountModal"  tabindex="-1" aria-labelledby="liveCountModalLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="liveCountModalLabel">{{$t('message.update_category')}}</h5>
                            <button type="button" id="btn-close" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            <form @submit.prevent="updateCategory">
                              <div class="text-start">
                                <div class="">
                                  <img :src="selectedCategory.url" v-if="selectedCategory.url!=='default'" width="100" height="100" alt="">
                                  <img src="../../assets/flash/1.png" v-else width="100" height="100" alt="">

                                </div>
                                <label for="img-input" class="mb-2" style="font-size: 12px;">{{ $t('message.upload_image')}}(Optional)</label>
                                <input type="file" @change="onChangeUpdatePhotoInput" accept="image/*" id="img-input" multiple class="form-control mb-3" ref="updatePhoto" placeholder="photo">
                              </div>
                              <div class="form-floating mb-3">
                                <input type="text" required class="form-control" v-model="newCategoryName" id="barcode-input" placeholder="enter shop name">
                                <label for="barcode-input">{{ $t('message.category_name') }}</label>
                              </div>
                              <div class="d-flex align-items-center" >
                                <button type="button" class="btn btn-sm me-2 w-50" style="background-color: var(--light);" data-bs-dismiss="modal">{{ $t('message.cancel') }}</button>
                                <button type="submit" class="btn btn-sm w-50" style="background-color: var(--btnLight);color: var(--text-color);">{{$t('message.confirm')}}</button>

                              </div>
                            </form>
                          </div>

                        </div>
                      </div>
                    </div>

                  </td>
                </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>



        <div class="col-12 col-md-3 mb-3" >
          <div class="p-2" style="background-color: var(--light);border-radius: var(--border-radius);">
            <div class="">
              <div class="card-body p-2">
                <form @submit.prevent="uploadTableCategory">
                  <div class="d-flex ">
                    <div class="form-floating w-100">
                      <input type="text" required class="form-control" v-model="tableCategory.name" id="category-name" placeholder="enter category name">
                      <label for="barcode-input">Enter Table Type</label>
                    </div>
                    <button type="submit" class="btn ms-2 text-nowrap" style="background-color: var(--btnLight);"><i class="fas fa-circle-plus "></i> Add</button>
                  </div>
                </form>
              </div>
            </div>
            <div class="table-responsive table-box">
              <table class="table table-hover table-striped">
                <tbody>
                <tr v-for="(category, index) in filterTableCategories" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{category.name}}</td>
                  <td class="text-end">
                    <button class="btn btn-outline-danger btn-sm me-1" @click="deleteTableCategory(category)" v-if="category.name!=='All'"><i class="fas fa-trash"></i></button>
                    <button type="button" class="btn btn-outline-warning btn-sm mx-1" @click="openTableCategoryEditBox(category)" v-if="category.name!=='All'" data-bs-toggle="modal" data-bs-target="#tableModal">
                      <i class="fas fa-edit"></i>
                    </button>
                    <div class="modal fade" style="z-index: 10000;" id="tableModal"  tabindex="-1" aria-labelledby="tableModalLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="tableModalLabel">Update Table Category</h5>
                            <button type="button" id="btn-close-table" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            <form @submit.prevent="updateTableCategory">
                              <div class="form-floating mb-3">
                                <input type="text" required class="form-control" v-model="newTableCateName" id="barcode-input" placeholder="enter shop name">
                                <label for="barcode-input">Enter table category name</label>
                              </div>
                              <div class="d-flex align-items-center" >
                                <button type="button" class="btn btn-sm me-2 w-50" style="background-color: var(--light);" data-bs-dismiss="modal">{{ $t('message.cancel') }}</button>
                                <button type="submit" class="btn btn-sm w-50" style="background-color: var(--btnLight);color: var(--text-color);">{{$t('message.confirm')}}</button>
                              </div>
                            </form>
                          </div>

                        </div>
                      </div>
                    </div>

                  </td>
                  <!--                <td><i class="fas fa-calendar m-1"></i> <span>{{category.createdAt.toDate().toLocaleDateString()}}</span> <i class="fas fa-clock mx-1"></i> <span>{{category.createdAt.toDate().toLocaleTimeString()}}</span></td>-->
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-3 mb-3" >
          <div class="p-2" style="background-color: var(--light);border-radius: var(--border-radius);">
            <div class="">
              <div class="card-body p-2">
                <form @submit.prevent="uploadKitchen">
                  <div class="d-flex ">
                    <div class="form-floating w-100">
                      <input type="text" required class="form-control" v-model="kitchen.name" id="category-name" placeholder="enter category name">
                      <label for="barcode-input">Enter kitchen name</label>
                    </div>
                    <button type="submit" class="btn ms-2 text-nowrap" style="background-color: var(--btnLight);"><i class="fas fa-circle-plus "></i> Add</button>
                  </div>
                </form>
              </div>
            </div>
            <div class="table-responsive table-box">
              <table class="table table-hover table-striped">
                <tbody>
                <tr v-for="(category, index) in filterKitchens" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{category.name}}</td>
                  <td class="text-end">
                    <button class="btn btn-outline-danger btn-sm me-1" @click="deleteKitchen(category)" v-if="category.name!=='All'"><i class="fas fa-trash"></i></button>
                    <button type="button" class="btn btn-outline-warning btn-sm mx-1" @click="openKitchenEditBox(category)" v-if="category.name!=='All'" data-bs-toggle="modal" data-bs-target="#kitchenModal">
                      <i class="fas fa-edit"></i>
                    </button>
                    <div class="modal fade" style="z-index: 10000;" id="kitchenModal"  tabindex="-1" aria-labelledby="kitchenModalLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="kitchenModalLabel">Update Table Category</h5>
                            <button type="button" id="btn-close-kitchen" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            <form @submit.prevent="updateKitchen">
                              <div class="form-floating mb-3">
                                <input type="text" required class="form-control" v-model="newKitchenName" id="barcode-input" placeholder="enter shop name">
                                <label for="barcode-input">Enter table category name</label>
                              </div>
                              <div class="d-flex align-items-center" >
                                <button type="button" class="btn btn-sm me-2 w-50" style="background-color: var(--light);" data-bs-dismiss="modal">{{ $t('message.cancel') }}</button>
                                <button type="submit" class="btn btn-sm w-50" style="background-color: var(--btnLight);color: var(--text-color);">{{$t('message.confirm')}}</button>
                              </div>
                            </form>
                          </div>

                        </div>
                      </div>
                    </div>

                  </td>
                  <!--                <td><i class="fas fa-calendar m-1"></i> <span>{{category.createdAt.toDate().toLocaleDateString()}}</span> <i class="fas fa-clock mx-1"></i> <span>{{category.createdAt.toDate().toLocaleTimeString()}}</span></td>-->
                </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>

<!--        Apartment Category-->
        <div class="col-12 col-md-3 mb-3" >
          <div class="p-2" style="background-color: var(--light);border-radius: var(--border-radius);">
            <div class="">
              <div class="card-body p-2">
                <form @submit.prevent="uploadApartmentType">
                  <div class="d-flex ">
                    <div class="form-floating w-100">
                      <input type="text" required class="form-control" v-model="apartmentType.name" id="category-name" placeholder="enter category name">
                      <label for="barcode-input">Enter Apartment Type</label>
                    </div>
                    <button type="submit" class="btn ms-2 text-nowrap" style="background-color: var(--btnLight);"><i class="fas fa-circle-plus "></i> Add</button>
                  </div>
                </form>
              </div>
            </div>
            <div class="table-responsive table-box">
              <table class="table table-hover table-striped">
                <tbody>
                <tr v-for="(category, index) in filterApartmentTypes" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{category.name}}</td>
                  <td class="text-end">
                    <button class="btn btn-outline-danger btn-sm me-1" @click="deleteApartmentType(category)" v-if="category.name!=='All'"><i class="fas fa-trash"></i></button>
                    <button type="button" class="btn btn-outline-warning btn-sm mx-1" @click="openApartmentTypeEditBox(category)" v-if="category.name!=='All'" data-bs-toggle="modal" data-bs-target="#apartmentModal">
                      <i class="fas fa-edit"></i>
                    </button>
                    <div class="modal fade" style="z-index: 10000;" id="apartmentModal"  tabindex="-1" aria-labelledby="kitchenModalLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="kitchenModalLabel">Update Apartment Type</h5>
                            <button type="button" id="btn-close-apartment" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            <form @submit.prevent="updateApartmentType">
                              <div class="form-floating mb-3">
                                <input type="text" required class="form-control" v-model="newApartmentTypeName" id="barcode-input" placeholder="enter shop name">
                                <label for="barcode-input">Enter table category name</label>
                              </div>
                              <div class="d-flex align-items-center" >
                                <button type="button" class="btn btn-sm me-2 w-50" style="background-color: var(--light);" data-bs-dismiss="modal">{{ $t('message.cancel') }}</button>
                                <button type="submit" class="btn btn-sm w-50" style="background-color: var(--btnLight);color: var(--text-color);">{{$t('message.confirm')}}</button>
                              </div>
                            </form>
                          </div>

                        </div>
                      </div>
                    </div>

                  </td>
                  <!--                <td><i class="fas fa-calendar m-1"></i> <span>{{category.createdAt.toDate().toLocaleDateString()}}</span> <i class="fas fa-clock mx-1"></i> <span>{{category.createdAt.toDate().toLocaleTimeString()}}</span></td>-->
                </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>
        
        <!--          Brand -->
        <div  class="col-12 col-md-3 mb-3">
          <div class="p-2 mb-1" style="background-color: var(--light);border-radius: var(--border-radius);">
            <div class="mb-1">
              <div class="">
                <div class="card-body p-2">
                  <form @submit.prevent="uploadBrand">
                    <div class="d-flex">
                      <div class="form-floating w-100">
                        <input type="text" required class="form-control form-control-sm" v-model="brand.name" id="category-name" placeholder="enter brand">
                        <label for="barcode-input">Enter Brand</label>
                      </div>
                      <button type="submit" class="btn ms-2 text-nowrap" style="background-color: var(--btnLight);"><i class="fas fa-circle-plus "></i> Add</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="table-responsive table-box">
              <table class="table table-hover table-striped">
                <tbody>
                <tr v-for="(category, index) in filterBrands" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{category.name}}</td>
                  <td class="text-end">
                    <button class="btn btn-outline-danger btn-sm me-1" @click="deleteBrand(category)" v-if="category.name!=='Nothing'"><i class="fas fa-trash"></i></button>
                    <button type="button" class="btn btn-outline-warning btn-sm mx-1" @click="openBrandEditBox(category)" v-if="category.name!=='Nothing'" data-bs-toggle="modal" data-bs-target="#brandModal">
                      <i class="fas fa-edit"></i>
                    </button>
                    <div class="modal fade" style="z-index: 10000;" id="brandModal"  tabindex="-1" aria-labelledby="brandLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="brandLabel">Update Brand</h5>
                            <button type="button" id="btn-close-brand" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            <form @submit.prevent="updateBrand">
                              <div class="form-floating mb-3">
                                <input type="text" required class="form-control" v-model="newBrandName" id="barcode-input" placeholder="enter brand name">
                                <label for="barcode-input">Enter Brand Name</label>
                              </div>
                              <div class="d-flex align-items-center" >
                                <button type="button" class="btn btn-sm me-2 w-50" style="background-color: var(--light);" data-bs-dismiss="modal">{{ $t('message.cancel') }}</button>
                                <button type="submit" class="btn btn-sm w-50" style="background-color: var(--btnLight);color: var(--text-color);">{{$t('message.confirm')}}</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

          </div>
          <!--            weight-->
        </div>

        <div class="col-12 col-md-3 mb-3">
          <div class="p-2" style="background-color: var(--light);border-radius: var(--border-radius);">
            <div class=" mb-1">
              <div class="">
                <div class="card-body p-2">
                  <form @submit.prevent="uploadWeight">
                    <div class="d-flex">
                      <div class="form-floating w-100">
                        <input type="text" required class="form-control form-control-sm" v-model="weight.name" id="category-name" placeholder="enter weight">
                        <label for="barcode-input">Enter Weight</label>
                      </div>
                      <button type="submit" class="btn ms-2 text-nowrap" style="background-color: var(--btnLight);"><i class="fas fa-circle-plus "></i> Add</button>

                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="table-responsive table-box">
              <table class="table table-hover table-striped">
                <tbody>
                <tr v-for="(category, index) in filterWeights" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{category.name}}</td>
                  <td class="text-end">
                    <button class="btn btn-outline-danger btn-sm me-1" @click="deleteWeight(category)" v-if="category.name!==''"><i class="fas fa-trash"></i></button>
                    <button type="button" class="btn btn-outline-warning btn-sm mx-1" @click="openWeightEditBox(category)" v-if="category.name!==''" data-bs-toggle="modal" data-bs-target="#weightModal">
                      <i class="fas fa-edit"></i>
                    </button>
                    <div class="modal fade" style="z-index: 10000;" id="weightModal"  tabindex="-1" aria-labelledby="weightLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="brandLabel">Update Weight</h5>
                            <button type="button" id="btn-close-weight" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            <form @submit.prevent="updateWeight">
                              <div class="form-floating mb-3">
                                <input type="text" required class="form-control" v-model="newWeightName" id="barcode-input" placeholder="enter weight name">
                                <label for="barcode-input">Enter Weight Name</label>
                              </div>
                              <div class="d-flex align-items-center" >
                                <button type="button" class="btn btn-sm me-2 w-50" style="background-color: var(--light);" data-bs-dismiss="modal">{{ $t('message.cancel') }}</button>
                                <button type="submit" class="btn btn-sm w-50" style="background-color: var(--btnLight);color: var(--text-color);">{{$t('message.confirm')}}</button>
                              </div>
                            </form>
                          </div>

                        </div>
                      </div>
                    </div>

                  </td>
                  <!--                <td><i class="fas fa-calendar m-1"></i> <span>{{category.createdAt.toDate().toLocaleDateString()}}</span> <i class="fas fa-clock mx-1"></i> <span>{{category.createdAt.toDate().toLocaleTimeString()}}</span></td>-->
                </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>

        <!--          Size and Color-->
        <div class="col-12 col-md-3 mb-3">
          <div class="p-2" style="background-color: var(--light);border-radius: var(--border-radius);">
            <div  class=" mb-1">
              <div class="">
                <div class="card-body p-2">
                  <form @submit.prevent="uploadSize">
                    <div class="d-flex">
                      <div class="form-floating w-100">
                        <input type="text" required class="form-control form-control-sm" v-model="size.name" id="category-name" placeholder="enter name">
                        <label for="barcode-input">Enter Size</label>
                      </div>
                      <button type="submit" class="btn ms-2 text-nowrap" style="background-color: var(--btnLight);"><i class="fas fa-circle-plus "></i> Add</button>

                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="table-responsive table-box">
                <table class="table table-hover table-striped">
                  <tbody>
                  <tr v-for="(category, index) in filterSizes" :key="index">
                    <td>{{index+1}}</td>
                    <td>{{category.name}}</td>
                    <td class="text-end">
                      <button class="btn btn-outline-danger btn-sm me-1" @click="deleteSize(category)" v-if="category.name!=='Free'"><i class="fas fa-trash"></i></button>
                      <button type="button" class="btn btn-outline-warning btn-sm mx-1" @click="openSizeEditBox(category)" v-if="category.name!=='Free'" data-bs-toggle="modal" data-bs-target="#sizeModal">
                        <i class="fas fa-edit"></i>
                      </button>
                      <div class="modal fade" style="z-index: 10000;" id="sizeModal"  tabindex="-1" aria-labelledby="sizeLabel" aria-hidden="true">
                        <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title" id="sizeLabel">Update Size</h5>
                              <button type="button" id="btn-close-size" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                              <form @submit.prevent="updateSize">
                                <div class="form-floating mb-3">
                                  <input type="text" required class="form-control" v-model="newSizeName" id="barcode-input" placeholder="enter size name">
                                  <label for="barcode-input">Name</label>
                                </div>
                                <div class="d-flex align-items-center" >
                                  <button type="button" class="btn btn-sm me-2 w-50" style="background-color: var(--light);" data-bs-dismiss="modal">{{ $t('message.cancel') }}</button>
                                  <button type="submit" class="btn btn-sm w-50" style="background-color: var(--btnLight);color: var(--text-color);">{{$t('message.confirm')}}</button>
                                </div>
                              </form>
                            </div>

                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
          </div>
          <!--            color-->
        </div>
        <div class="col-12 col-md-3 mb-3">
          <div style="background-color: var(--light);border-radius: var(--border-radius);" class="p-2 ">
            <div >
              <div class="">
                <div class="card-body p-2">
                  <form @submit.prevent="uploadColor">
                    <div class="d-flex">
                      <div class="form-floating w-100">
                        <input type="text" required class="form-control form-control-sm" v-model="color.name" id="category-name" placeholder="enter name">
                        <label for="barcode-input">Enter Color</label>
                      </div>
                      <button type="submit" class="btn ms-2 text-nowrap" style="background-color: var(--btnLight);"><i class="fas fa-circle-plus "></i> Add</button>

                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="table-responsive table-box">
                <table class="table table-hover table-striped">
                  <tbody>
                  <tr v-for="(category, index) in filterColors" :key="index">
                    <td>{{index+1}}</td>
                    <td>{{category.name}}</td>
                    <td class="text-end">
                      <button class="btn btn-outline-danger btn-sm me-1" @click="deleteColor(category)" v-if="category.name!=='All'"><i class="fas fa-trash"></i></button>
                      <button type="button" class="btn btn-outline-warning btn-sm mx-1" @click="openColorEditBox(category)" v-if="category.name!=='All'" data-bs-toggle="modal" data-bs-target="#colorModal">
                        <i class="fas fa-edit"></i>
                      </button>
                      <div class="modal fade" style="z-index: 10000;" id="colorModal"  tabindex="-1" aria-labelledby="colorLabel" aria-hidden="true">
                        <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title" id="colorLabel">Update Color</h5>
                              <button type="button" id="btn-close-color" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                              <form @submit.prevent="updateColor">
                                <div class="form-floating mb-3">
                                  <input type="text" required class="form-control" v-model="newColorName" id="barcode-input" placeholder="enter color name">
                                  <label for="barcode-input">Enter color</label>
                                </div>
                                <div class="d-flex align-items-center">
                                  <button type="button" class="btn btn-sm me-2 w-50" style="background-color: var(--light);" data-bs-dismiss="modal">{{ $t('message.cancel') }}</button>
                                  <button type="submit" class="btn btn-sm w-50" style="background-color: var(--btnLight);color: var(--text-color);">{{$t('message.confirm')}}</button>
                                </div>
                              </form>
                            </div>

                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>

          </div>

        </div>

      </div>

    </div>
  </AdminSidebar>
</template>

<script>
import db,{timestamp} from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
import firebase from "firebase/compat";
export default {
  components: {ConfirmDialog, InfoDialog, Loading, AdminSidebar},
  data(){
    return{
      search:'',
      searchBrand:'',
      dismissModal:'true',
      file:'',
      categories:[],
      brands:[],
      colors:[],
      sizes:[],
      weights:[],
      tableCategories:[],
      kitchens:[],
      apartmentTypes:[],

      newCategoryName:'',
      newBrandName:'',
      newColorName:'',
      newSizeName:'',
      newWeightName:'',
      newTableCateName:'',
      newKitchenName:'',
      newApartmentTypeName:'',

      confirmStatus:'',
      editFile:'',

      selectedCategory:'',
      selectedBrand:'',
      selectedSize:'',
      selectedColor:'',
      selectedWeight:'',
      selectedTableCategory:'',
      selectedKitchen:'',
      selectedApartmentType:'',

      productsOfCategory:[],
      productsOfBrand:[],
      productsOfSize:[],
      productsOfColor:[],
      productsOfWeight:[],
      productsOfTable:[],
      productsOfKitchen:[],
      productsOfApartmentType:[],

      category:{
        name:"",
        id:"",
        url:"default",
      },


      tableCategory:{
        name:"",
        id:"",
      },
      brand:{
        name:"",
        id:"",
        createdAt:"",
      },
      size:{
        name:"",
        id:"",
        createdAt:"",
      },
      color:{
        name:"",
        id:"",
        createdAt:"",
      },
      weight:{
        name:"",
        id:"",
        createdAt:"",
      },
      kitchen:{
        name:"",
        id:""
      },
      apartmentType:{
        name:"",
        id:""
      },
      loadingActive:false,
      infoModalActive:false,
      confirmActive:false,
      modalMessage:'',
      deleteId:'',
    }
  },
  computed:{
    shopInfo(){
      return this.$store.getters.getShopInfo;
    },
    owner(){
      return this.$store.getters.getShopOwner;
    },
    filterCategories(){
      if(this.category.name!==''){
        return this.categories.filter(cate=>cate.name.toLowerCase().includes(this.category.name.toLowerCase()))
      }else {
        return this.categories
      }
    },
    filterBrands(){
      if(this.brand.name!==''){
        return this.brands.filter(cate=>cate.name.toLowerCase().includes(this.brand.name.toLowerCase()))
      }else {
        return this.brands
      }
    },
    filterSizes(){
      if(this.size.name!==''){
        return this.sizes.filter(cate=>cate.name.toLowerCase().includes(this.size.name.toLowerCase()))
      }else {
        return this.sizes
      }
    },
    filterColors(){
      if(this.color.name!==''){
        return this.colors.filter(cate=>cate.name.toLowerCase().includes(this.color.name.toLowerCase()))
      }else {
        return this.colors
      }
    },
    filterWeights(){
      if(this.weight.name!==''){
        return this.weights.filter(cate=>cate.name.toLowerCase().includes(this.weight.name.toLowerCase()))
      }else {
        return this.weights
      }
    },
    filterKitchens(){
      if(this.kitchen.name!==''){
        return this.kitchens.filter(cate=>cate.name.toLowerCase().includes(this.kitchen.name.toLowerCase()))
      }else {
        return this.kitchens
      }
    },
    filterApartmentTypes(){
      if(this.apartmentType.name!==''){
        return this.apartmentTypes.filter(cate=>cate.name.toLowerCase().includes(this.apartmentType.name.toLowerCase()))
      }else {
        return this.apartmentTypes
      }
    },
    filterTableCategories(){
      if(this.tableCategory.name!==''){
        return this.tableCategories.filter(cate=>cate.name.toLowerCase().includes(this.tableCategory.name.toLowerCase()))
      }else {
        return this.tableCategories
      }
    },


  },
  async mounted() {
    this.$store.dispatch("getShopInfo", this.owner)

    await db.collection(this.owner.city).doc(this.owner.shopId).collection('category').orderBy('name').onSnapshot(snapshot => {
      this.categories = [];
      snapshot.forEach(doc=>{
        this.categories.push(doc.data());
      })
    })
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('brand').orderBy('name').onSnapshot(snapshot => {
      this.brands = [];
      snapshot.forEach(doc=>{
        this.brands.push(doc.data());
      })
    })
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('size').orderBy('name').onSnapshot(snapshot => {
      this.sizes = [];
      snapshot.forEach(doc=>{
        this.sizes.push(doc.data());
      })
    })
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('color').orderBy('name').onSnapshot(snapshot => {
      this.colors = [];
      snapshot.forEach(doc=>{
        this.colors.push(doc.data());
      })
    })
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('weight').orderBy('name').onSnapshot(snapshot => {
      this.weights = [];
      snapshot.forEach(doc=>{
        this.weights.push(doc.data());
      })
    })
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('tableCategory').orderBy('name').onSnapshot(snapshot => {
      this.tableCategories = [];
      snapshot.forEach(doc=>{
        this.tableCategories.push(doc.data());
      })
    })
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('kitchens').orderBy('name').onSnapshot(snapshot => {
      this.kitchens = [];
      snapshot.forEach(doc=>{
        this.kitchens.push(doc.data());
      })
    })
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('apartmentTypes').orderBy('name').onSnapshot(snapshot => {
      this.apartmentTypes = [];
      snapshot.forEach(doc=>{
        this.apartmentTypes.push(doc.data());
      })
    })
  },
  methods:{
    onChangePhotoInput(e) {
      this.file = e.target.files[0];
    },

    onChangeUpdatePhotoInput(e) {
      this.editFile = e.target.files[0];
    },

    closeInfoModal(){
      this.infoModalActive = !this.infoModalActive;
      document.getElementById('btn-close-brand').click();
      document.getElementById('btn-close-color').click();
      document.getElementById('btn-close-size').click();
      document.getElementById('btn-close-weight').click();
      document.getElementById('btn-close').click();
      document.getElementById('btn-close-table').click();
      document.getElementById('btn-close-kitchen').click();
      document.getElementById('btn-close-apartment').click();


    },

    cancel(){
      this.confirmActive = !this.confirmActive;
      this.loadingActive = false;
    },

    async confirm(){
      if(this.confirmStatus === 'delete'){
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
        
        if(this.selectedCategory.url!=='default'){
          const storageRef = await firebase.storage().ref();
          // Create a reference to the file to delete
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/category/${this.deleteId}`)
          // Delete the file
          imgRef.delete().then(() => {
            console.log('delete ok')

            db.collection(this.owner.city).doc(this.owner.shopId).collection('category').doc(this.deleteId).delete().then(()=>{
              this.loadingActive = false;
              this.modalMessage=this.$t('message.deleted');
              this.infoModalActive=true;
            });
            // File deleted successfully
          }).catch((error) => {
            console.log(error.message)
            // Uh-oh, an error occurred!
          });
        }else {
          db.collection(this.owner.city).doc(this.owner.shopId).collection('category').doc(this.deleteId).delete().then(()=>{
            this.loadingActive = false;
            this.modalMessage=this.$t('message.deleted');
            this.infoModalActive=true;
          })
        }

      }
      else if(this.confirmStatus === 'deleteBrand'){
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
          db.collection(this.owner.city).doc(this.owner.shopId).collection('brand').doc(this.deleteId).delete().then(()=>{
            this.loadingActive = false;
            this.modalMessage=this.$t('message.deleted');
            this.infoModalActive=true;
          })
      }
      else if(this.confirmStatus === 'deleteSize'){
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
        db.collection(this.owner.city).doc(this.owner.shopId).collection('size').doc(this.deleteId).delete().then(()=>{
          this.loadingActive = false;
          this.modalMessage=this.$t('message.deleted');
          this.infoModalActive=true;
        })
      }
      else if(this.confirmStatus === 'deleteColor'){
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
        db.collection(this.owner.city).doc(this.owner.shopId).collection('color').doc(this.deleteId).delete().then(()=>{
          this.loadingActive = false;
          this.modalMessage=this.$t('message.deleted');
          this.infoModalActive=true;
        })
      } else if(this.confirmStatus === 'deleteWeight'){
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
        db.collection(this.owner.city).doc(this.owner.shopId).collection('weight').doc(this.deleteId).delete().then(()=>{
          this.loadingActive = false;
          this.modalMessage=this.$t('message.deleted');
          this.infoModalActive=true;
        })
      }
      else if(this.confirmStatus === 'deleteTableCategory'){
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
        db.collection(this.owner.city).doc(this.owner.shopId).collection('tableCategory').doc(this.deleteId).delete().then(()=>{
          this.loadingActive = false;
          this.modalMessage=this.$t('message.deleted');
          this.infoModalActive=true;
        })
      }else if(this.confirmStatus === 'deleteKitchen'){
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
        db.collection(this.owner.city).doc(this.owner.shopId).collection('kitchens').doc(this.deleteId).delete().then(()=>{
          this.loadingActive = false;
          this.modalMessage=this.$t('message.deleted');
          this.infoModalActive=true;
        })

      }
      else if(this.confirmStatus === 'deleteApartmentType'){
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
        db.collection(this.owner.city).doc(this.owner.shopId).collection('apartmentTypes').doc(this.deleteId).delete().then(()=>{
          this.loadingActive = false;
          this.modalMessage=this.$t('message.deleted');
          this.infoModalActive=true;
        })

      }
      else if(this.confirmStatus === 'brandUpdate'){
        this.updateBrandConfirm();
      }else if(this.confirmStatus === 'sizeUpdate'){
        this.updateSizeConfirm();
      }else if(this.confirmStatus === 'colorUpdate'){
        this.updateColorConfirm();
      }else if(this.confirmStatus === 'weightUpdate'){
        this.updateWeightConfirm();
      }else if(this.confirmStatus === 'tableCategoryUpdate'){
        this.updateTableCategoryConfirm();
      }
      else if(this.confirmStatus === 'kitchenUpdate'){
        this.updateKitchenConfirm();
      }
      else if(this.confirmStatus === 'apartmentTypeUpdate'){
        this.updateApartmentTypeConfirm();
      }

      else {
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
        console.log('edit confirmed');
        this.updateCategoryConfirm();
      }

    },

    async deleteCategory(category){
      this.deleteId = category.id;
      this.selectedCategory = category;
      this.confirmStatus = 'delete';
      this.confirmActive = true;
      // await this.getProductsOfCategory();
      // if(this.productsOfCategory.length>0){
      //   this.modalMessage = this.$t('message.category_delete_confirm')
      // }else {
      //   this.modalMessage = this.$t('message.delete_confirm')
      // }
    },


    async deleteBrand(brand){
      this.deleteId = brand.id;
      this.confirmStatus = 'deleteBrand';
      this.confirmActive = true;
      await this.getProductsOfBrand();
      if(this.productsOfBrand.length>0){
        this.modalMessage = "There are related products with this brand.Are you sure to delete the brand?"
      }else {
        this.modalMessage = this.$t('message.delete_confirm')
      }
    },
    async deleteSize(size){
      this.deleteId = size.id;
      this.confirmStatus = 'deleteSize';
      this.confirmActive = true;
      await this.getProductsOfBrand();
      if(this.productsOfBrand.length>0){
        this.modalMessage = "There are related products with this size.Are you sure to delete the size?"
      }else {
        this.modalMessage = this.$t('message.delete_confirm')
      }
    },
    async deleteColor(color){
      this.deleteId = color.id;
      this.confirmStatus = 'deleteSize';
      this.confirmActive = true;
      await this.getProductsOfBrand();
      if(this.productsOfBrand.length>0){
        this.modalMessage = "There are related products with this color.Are you sure to delete the color?"
      }else {
        this.modalMessage = this.$t('message.delete_confirm')
      }
    },
    async deleteWeight(weight){
      this.deleteId = weight.id;
      this.confirmStatus = 'deleteWeight';
      this.confirmActive = true;
      await this.getProductsOfBrand();
      if(this.productsOfWeight.length>0){
        this.modalMessage = "There are related products with this weight.Are you sure to delete the weight?"
      }else {
        this.modalMessage = this.$t('message.delete_confirm')
      }
    },

    async deleteTableCategory(weight){
      this.deleteId = weight.id;
      this.confirmStatus = 'deleteTableCategory';
      this.confirmActive = true;
      await this.getProductsOfBrand();
      if(this.productsOfTable.length>0){
        this.modalMessage = "There are related products with this table category.Are you sure to delete the table category?"
      }else {
        this.modalMessage = this.$t('message.delete_confirm')
      }
    },
    async deleteKitchen(kitchen){
      this.deleteId = kitchen.id;
      this.confirmStatus = 'deleteKitchen';
      this.confirmActive = true;
      await this.getProductsOfKitchen();
      if(this.productsOfTable.length>0){
        this.modalMessage = "There are related products with this kitchen.Are you sure to delete the kitchen?"
      }else {
        this.modalMessage = this.$t('message.delete_confirm')
      }
    },
    async deleteApartmentType(apartment){
      this.deleteId = apartment.id;
      this.confirmStatus = 'deleteApartmentType';
      this.confirmActive = true;
      await this.getProductsOfApartmentType();
      if(this.productsOfApartmentType.length>0){
        this.modalMessage = "There are related rooms with this type.Are you sure to delete the type?"
      }else {
        this.modalMessage = this.$t('message.delete_confirm')
      }
    },

    async openBrandEditBox(brand){
      this.selectedBrand = brand;
      this.newBrandName = brand.name;
      await this.getProductsOfBrand();

    },
    async openSizeEditBox(size){
      this.selectedSize = size;
      this.newSizeName = size.name;
      await this.getProductsOfSize();

    },
    async openColorEditBox(color){
      this.selectedColor = color;
      this.newColorName = color.name;
      await this.getProductsOfColor();

    },
    async openWeightEditBox(weight){
      this.selectedWeight = weight;
      this.newWeightName = weight.name;
      await this.getProductsOfWeight();

    },

    async openEditBox(category){
      this.selectedCategory = category;
      this.newCategoryName = category.name;
      await this.getProductsOfCategory();
    },


    async openTableCategoryEditBox(category){
      this.selectedTableCategory= category;
      this.newTableCateName = category.name;
      await this.getProductsOfTableCategory();
    },
    async openKitchenEditBox(category){
      this.selectedKitchen= category;
      this.newKitchenName = category.name;
      await this.getProductsOfKitchen();
    },
    async openApartmentTypeEditBox(category){
      this.selectedApartmentType= category;
      this.newApartmentTypeName = category.name;
      await this.getProductsOfApartmentType();
    },

    async getProductsOfCategory(){
      this.productsOfCategory=[];
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('type','==',this.selectedCategory.name).limit(1).get().then(snapshot => {
        snapshot.forEach(doc=>{
          this.productsOfCategory.push(doc.data())
        });
        console.log( "productsOfCategory", this.productsOfCategory)
      });
    },


    async getProductsOfBrand(){
      this.productsOfBrand=[];
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('brand','==',this.selectedBrand.name).limit(1).get().then(snapshot => {
        snapshot.forEach(doc=>{
          this.productsOfCategory.push(doc.data())
        });
        // console.log(this.productsOfCategory)
      });
    },
    async getProductsOfSize(){
      this.productsOfSize=[];
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('size','==',this.selectedSize.name).limit(1).get().then(snapshot => {
        snapshot.forEach(doc=>{
          this.productsOfSize.push(doc.data())
        });
        // console.log(this.productsOfCategory)
      });
    },
    async getProductsOfColor(){
      this.productsOfColor=[];
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('color','==',this.selectedColor.name).limit(1).get().then(snapshot => {
        snapshot.forEach(doc=>{
          this.productsOfColor.push(doc.data())
        });
        // console.log(this.productsOfCategory)
      });
    },
    async getProductsOfWeight(){
      this.productsOfWeight=[];
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('weight','==',this.selectedWeight.name).limit(1).get().then(snapshot => {
        snapshot.forEach(doc=>{
          this.productsOfWeight.push(doc.data())
        });
        // console.log(this.productsOfCategory)
      });
    },
    async getProductsOfTableCategory(){
      this.productsOfTable=[];
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('tables').where('categoryTypeId','==',this.selectedTableCategory.id).limit(1).get().then(snapshot => {
        snapshot.forEach(doc=>{
          this.productsOfTable.push(doc.data())
        });
        // console.log(this.productsOfCategory)
      });
    },
    async getProductsOfKitchen(){
      this.productsOfKitchen=[];
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('kitchens').where('kitchenType','==',this.selectedKitchen.name).limit(1).get().then(snapshot => {
        snapshot.forEach(doc=>{
          this.productsOfKitchen.push(doc.data())
        });
        // console.log(this.productsOfCategory)
      });
    },
    async getProductsOfApartmentType(){
      this.productsOfApartmentType=[];
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('apartments').where('apartmentType','==',this.selectedApartmentType.name).limit(1).get().then(snapshot => {
        snapshot.forEach(doc=>{
          this.productsOfApartmentType.push(doc.data())
        });
        // console.log(this.productsOfCategory)
      });
    },

    async updateCategory(){
      if(this.productsOfCategory.length>0){
        this.confirmActive = true;
        this.confirmStatus = 'edit'
        this.modalMessage = this.$t('message.category_update_confirm')
      }else {
        console.log("else is", )
        this.updateCategoryConfirm();
      }
    },


    async updateBrand(){
      if(this.productsOfBrand.length>0){
        this.confirmActive = true;
        this.confirmStatus = 'brandUpdate'
        this.modalMessage = this.$t('message.category_update_confirm')
      }else {
        this.updateBrandConfirm();

      }
    },
    async updateSize(){
      if(this.productsOfSize.length>0){
        this.confirmActive = true;
        this.confirmStatus = 'sizeUpdate'
        this.modalMessage = this.$t('message.category_update_confirm')
      }else {
        this.updateSizeConfirm();

      }
    },
    async updateColor(){
      if(this.productsOfColor.length>0){
        this.confirmActive = true;
        this.confirmStatus = 'colorUpdate'
        this.modalMessage = this.$t('message.category_update_confirm')
      }else {
        this.updateColorConfirm();

      }
    },
    async updateWeight(){
      if(this.productsOfWeight.length>0){
        this.confirmActive = true;
        this.confirmStatus = 'weightUpdate'
        this.modalMessage = this.$t('message.category_update_confirm')
      }else {
        this.updateWeightConfirm();

      }
    },
    async updateTableCategory(){
      //db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('type','==',this.selectedCategory.name).onSnapshot(snapshot => {});
      if(this.productsOfTable.length>0){
        this.confirmActive = true;
        this.confirmStatus = 'tableCategoryUpdate'
        this.modalMessage = this.$t('message.category_update_confirm')
      }else {
        this.updateTableCategoryConfirm();

      }
    },
    async updateKitchen(){
      //db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('type','==',this.selectedCategory.name).onSnapshot(snapshot => {});
      if(this.productsOfKitchen.length>0){
        this.confirmActive = true;
        this.confirmStatus = 'tableCategoryUpdate'
        this.modalMessage = this.$t('message.category_update_confirm')
      }else {
        this.updateKitchenConfirm();

      }
    },
    async updateApartmentType(){
      //db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('type','==',this.selectedCategory.name).onSnapshot(snapshot => {});
      if(this.productsOfApartmentType.length>0){
        this.confirmActive = true;
        this.confirmStatus = 'apartmentTypeUpdate'
        this.modalMessage = this.$t('message.category_update_confirm')
      }else {
        this.updateApartmentTypeConfirm();

      }
    },

    updateCategoryConfirm(){
      if(!this.editFile){
        this.loadingActive = true;
        if(this.newCategoryName === this.selectedCategory.name){
          this.loadingActive = false;
          document.getElementById('btn-close').click();
        }else {
          db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('type','==',this.selectedCategory.name).get().then(snapshot=>{
            console.log('snap size',snapshot.size)
            if(snapshot){
              snapshot.docs.forEach((doc,index)=>{
                db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(doc.data().id).update({
                  type:this.newCategoryName
                });
                console.log(index,'==',snapshot.docs.length)
                if(index+1 === snapshot.docs.length){
                  db.collection(this.owner.city).doc(this.owner.shopId).collection('category').doc(this.selectedCategory.id).update({
                    'name':this.newCategoryName
                  });
                  console.log('update ok')
                  this.loadingActive = false;
                  document.getElementById('btn-close').click();
                }

              })
            }else {
              db.collection(this.owner.city).doc(this.owner.shopId).collection('category').doc(this.selectedCategory.id).update({
                'name':this.newCategoryName
              });
              console.log('update ok')
              this.loadingActive = false;
              document.getElementById('btn-close').click();
            }

          });
        }

      }else {
        this.loadingActive= true;
        console.log(this.selectedCategory.id)
        const storageRef = firebase.storage().ref();
        const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/category/${this.selectedCategory.id}`)
        imgRef.put(this.editFile).on("state_changed", () => {
        }, error => {
          console.log(error);
        }, async () => {
          const img_src = await imgRef.getDownloadURL();
          this.selectedCategory.url = img_src;
          await db.collection(this.owner.city).doc(this.owner.shopId).collection('category').doc(this.selectedCategory.id).update({
            'url':img_src
          }).then(()=>{
            if(this.selectedCategory.name === this.newCategoryName){
              this.loadingActive = false;
              console.log('update ok')
              document.getElementById('btn-close').click();
            }else {
              db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('type','==',this.selectedCategory.name).get().then(snapshot=>{
                if(!snapshot.empty){
                  snapshot.forEach((doc,index)=>{
                    db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(doc.data().id).update({
                      type:this.newCategoryName
                    });
                    if(index+1 === snapshot.size){
                      db.collection(this.owner.city).doc(this.owner.shopId).collection('category').doc(this.selectedCategory.id).update({
                        'name':this.newCategoryName
                      });
                      console.log('update ok')
                      this.loadingActive = false;
                      document.getElementById('btn-close').click();
                    }
                  })
                }else {
                  db.collection(this.owner.city).doc(this.owner.shopId).collection('category').doc(this.selectedCategory.id).update({
                    'name':this.newCategoryName
                  });
                  console.log('update ok')
                  this.loadingActive = false;
                  document.getElementById('btn-close').click();
                }

              });
            }
          })
        })
      }
    },
    updateBrandConfirm(){
      if(this.newBrandName === this.selectedBrand.name){
        this.loadingActive = false;
        document.getElementById('btn-close-brand').click();
      }else {
        this.loadingActive = true;
        db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('brand','==',this.selectedBrand.name).get().then(snapshot=>{
          console.log('snap size',snapshot.size)
          if(!snapshot.empty){
            snapshot.docs.forEach((doc,index)=>{
              db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(doc.data().id).update({
                'brand':this.newBrandName
              });
              if(index+1 === snapshot.docs.length){
                db.collection(this.owner.city).doc(this.owner.shopId).collection('brand').doc(this.selectedBrand.id).update({
                  'name':this.newBrandName
                });
                this.loadingActive = false;
                this.infoModalActive = true;
                this.confirmActive = false;
                this.modalMessage = 'Updated!'
                document.getElementById('btn-close-brand').click();
              }

            })
          }else {
            db.collection(this.owner.city).doc(this.owner.shopId).collection('brand').doc(this.selectedBrand.id).update({
              'name':this.newBrandName
            });
            this.loadingActive = false;
            this.confirmActive=false;
            this.infoModalActive = true;
            this.modalMessage = 'Updated!'
            document.getElementById('btn-close-brand').click();
          }

        });
      }
    },
    updateColorConfirm(){
      if(this.newColorName === this.selectedColor.name){
        this.loadingActive = false;
        document.getElementById('btn-close-color').click();
      }else {
        this.loadingActive = true;
        db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('color','==',this.selectedColor.name).get().then(snapshot=>{
          console.log('snap size',snapshot.size)
          if(!snapshot.empty){
            snapshot.docs.forEach((doc,index)=>{
              db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(doc.data().id).update({
                'color':this.newColorName
              });
              if(index+1 === snapshot.docs.length){
                db.collection(this.owner.city).doc(this.owner.shopId).collection('color').doc(this.selectedColor.id).update({
                  'name':this.newColorName
                });
                this.loadingActive = false;
                this.infoModalActive = true;
                this.confirmActive=false;
                this.modalMessage = 'Updated!'
                document.getElementById('btn-close-color').click();
              }

            })
          }else {
            db.collection(this.owner.city).doc(this.owner.shopId).collection('color').doc(this.selectedColor.id).update({
              'name':this.newColorName
            });
            this.loadingActive = false;
            this.confirmActive=false;
            this.infoModalActive = true;
            this.modalMessage = 'Updated!'
            document.getElementById('btn-close-color').click();
          }

        });
      }
    },
    updateSizeConfirm(){
      if(this.newSizeName === this.selectedSize.name){
        this.loadingActive = false;
        document.getElementById('btn-close-size').click();
      }else {
        this.loadingActive = true;
        db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('size','==',this.selectedSize.name).get().then(snapshot=>{
          console.log('snap size',snapshot.size)
          if(!snapshot.empty){
            snapshot.docs.forEach((doc,index)=>{
              db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(doc.data().id).update({
                size:this.newSizeName
              });
              if(index+1 === snapshot.docs.length){
                db.collection(this.owner.city).doc(this.owner.shopId).collection('size').doc(this.selectedSize.id).update({
                  'name':this.newSizeName
                });
                this.loadingActive = false;
                this.confirmActive=false;
                this.infoModalActive = true;
                this.modalMessage = 'Updated!'
                document.getElementById('btn-close-size').click();
              }

            })
          }else {
            db.collection(this.owner.city).doc(this.owner.shopId).collection('size').doc(this.selectedSize.id).update({
              'name':this.newSizeName
            });
            this.loadingActive = false;
            this.confirmActive=false;
            this.infoModalActive = true;
            this.modalMessage = 'Updated!'
            document.getElementById('btn-close-size').click();
          }

        });
      }
    },
    updateWeightConfirm(){
      if(this.newWeightName === this.selectedWeight.name){
        this.loadingActive = false;
        document.getElementById('btn-close-weight').click();
      }else {
        this.loadingActive = true;
        db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('weight','==',this.selectedWeight.name).get().then(snapshot=>{
          console.log('snap size',snapshot.size)
          if(!snapshot.empty){
            snapshot.docs.forEach((doc,index)=>{
              db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(doc.data().id).update({
                weight:this.newWeightName
              });
              if(index+1 === snapshot.docs.length){
                db.collection(this.owner.city).doc(this.owner.shopId).collection('size').doc(this.selectedWeight.id).update({
                  'name':this.newWeightName
                });
                this.loadingActive = false;
                this.infoModalActive = true;
                this.confirmActive=false;
                this.modalMessage = 'Updated!'
                document.getElementById('btn-close-size').click();
              }

            })
          }else {
            db.collection(this.owner.city).doc(this.owner.shopId).collection('weight').doc(this.selectedWeight.id).update({
              'name':this.newWeightName
            });
            this.loadingActive = false;
            this.confirmActive=false;
            this.infoModalActive = true;
            this.modalMessage = 'Updated!'
            document.getElementById('btn-close-size').click();
          }

        });
      }
    },
    updateTableCategoryConfirm(){
      console.log('selected table', this.selectedTableCategory)
      if(this.newTableCateName === this.selectedTableCategory.name){
        this.loadingActive = false;
        document.getElementById('btn-close-table').click();
      }else {
        this.loadingActive = true;
        db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection('tables')
            .where('categoryTypeId','==',this.selectedTableCategory.id)
            .get().then(snapshot=>{
          console.log('snap size',snapshot.size)
          if(!snapshot.empty){
            snapshot.docs.forEach((doc,index)=>{
              db.collection(this.owner.city)
                  .doc(this.owner.shopId)
                  .collection('tables')
                  .doc(doc.data().id)
                  .update({
                categoryType:this.newTableCateName
              });
              if(index+1 === snapshot.docs.length){
                db.collection(this.owner.city)
                    .doc(this.owner.shopId)
                    .collection('tableCategory')
                    .doc(this.selectedTableCategory.id).update({
                  'name':this.newTableCateName
                });
                this.loadingActive = false;
                this.infoModalActive = true;
                this.confirmActive=false;
                this.modalMessage = 'Updated!'
                document.getElementById('btn-close-table').click();
              }

            })
          }else {
            db.collection(this.owner.city)
                .doc(this.owner.shopId)
                .collection('tableCategory')
                .doc(this.selectedTableCategory.id)
                .update({
              'name':this.newTableCateName
            });
            this.loadingActive = false;
            this.confirmActive=false;
            this.infoModalActive = true;
            this.modalMessage = 'Updated!'
            document.getElementById('btn-close-table').click();
          }

        });
      }
    },
    updateKitchenConfirm(){
      if(this.newKitchenName === this.selectedKitchen.name){
        this.loadingActive = false;
        document.getElementById('btn-close-kitchen').click();
      }else {
        this.loadingActive = true;
        db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection('products')
            .where('kitchenType','==',this.selectedKitchen.name)
            .get().then(snapshot=>{
          console.log('snap size',snapshot.size)
          if(!snapshot.empty){
            snapshot.docs.forEach((doc,index)=>{
              db.collection(this.owner.city)
                  .doc(this.owner.shopId)
                  .collection('products')
                  .doc(doc.data().id)
                  .update({
                    kitchenType:this.newKitchenName
                  });
              if(index+1 === snapshot.docs.length){
                db.collection(this.owner.city)
                    .doc(this.owner.shopId)
                    .collection('kitchens')
                    .doc(this.selectedKitchen.id).update({
                  'name':this.newKitchenName
                });
                this.loadingActive = false;
                this.infoModalActive = true;
                this.confirmActive=false;
                this.modalMessage = 'Updated!'
                document.getElementById('btn-close-kitchen').click();
              }

            })
          }else {
            db.collection(this.owner.city)
                .doc(this.owner.shopId)
                .collection('kitchens')
                .doc(this.selectedKitchen.id)
                .update({
                  'name':this.newKitchenName
                });
            this.loadingActive = false;
            this.confirmActive=false;
            this.infoModalActive = true;
            this.modalMessage = 'Updated!'
            document.getElementById('btn-close-kitchen').click();
          }

        });
      }
    },
    updateApartmentTypeConfirm(){
      if(this.newApartmentTypeName === this.selectedApartmentType.name){
        this.loadingActive = false;
        document.getElementById('btn-close-apartment').click();
      }else {
        this.loadingActive = true;
        db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection('apartments')
            .where('apartmentType','==',this.selectedApartmentType.name)
            .get().then(snapshot=>{
          console.log('snap size',snapshot.size)
          if(!snapshot.empty){
            snapshot.docs.forEach((doc,index)=>{
              db.collection(this.owner.city)
                  .doc(this.owner.shopId)
                  .collection('apartments')
                  .doc(doc.data().id)
                  .update({
                    apartmentType:this.newApartmentTypeName
                  });
              if(index+1 === snapshot.docs.length){
                db.collection(this.owner.city)
                    .doc(this.owner.shopId)
                    .collection('apartmentTypes')
                    .doc(this.selectedApartmentType.id).update({
                  'name':this.newApartmentTypeName
                });
                this.loadingActive = false;
                this.infoModalActive = true;
                this.confirmActive=false;
                this.modalMessage = 'Updated!'
                document.getElementById('btn-close-apartment').click();
              }

            })
          }else {
            db.collection(this.owner.city)
                .doc(this.owner.shopId)
                .collection('apartmentTypes')
                .doc(this.selectedApartmentType.id)
                .update({
                  'name':this.newApartmentTypeName
                });
            this.loadingActive = false;
            this.confirmActive=false;
            this.infoModalActive = true;
            this.modalMessage = 'Updated!'
            document.getElementById('btn-close-close').click();
          }

        });
      }
    },

    async upload(){
      if(this.category.name!==''){
        let isSame = false;
        for(let i =0; i<this.categories.length;i++){
          if(this.categories[i].name.toLowerCase() === this.category.name.toLowerCase()){
            isSame = true;
            break;
          }else {
            isSame = false;
          }
        }
        if(!isSame){
          const categoryRef =  await db.collection(this.owner.city).doc(this.owner.shopId).collection('category').doc()
          this.category.createdAt = timestamp;
          this.category.id = categoryRef.id;
          if(this.file) {
            this.loadingActive = true;
            const storageRef = await firebase.storage().ref();
            const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/category/${categoryRef.id}`)
            imgRef.put(this.file).on("state_changed", () => {
            }, error => {
              console.log(error);
            }, async () => {
              const img_src = await imgRef.getDownloadURL();
              this.category.url = img_src;
              categoryRef.set(this.category).then(()=>{
                this.loadingActive = false;
                this.infoModalActive = true;
                this.modalMessage = "Success"
              }).catch(error=>{
                console.log(error.message)
              })
            });
          }else {
            categoryRef.set(this.category).then(()=>{
              this.category.name = '';
              /*this.loadingActive = false;
              this.infoModalActive = true;
              this.modalMessage = "Success"*/
            }).catch(error=>{
              console.log(error.message)
            })
          }
        }else {
          this.infoModalActive = true;
          this.modalMessage = this.$t('message.cate_already_exist')
        }

      }else {
        // this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = this.$t('message.enter_category')
      }
    },
    async uploadBrand(){
      if(this.brand.name!==''){
        let isSame = false;
        for(let i =0; i<this.brands.length;i++){
          if(this.brands[i].name.toLowerCase() === this.brand.name.toLowerCase()){
            isSame = true;
            break;
          }else {
            isSame = false;
          }
        }
        if(!isSame){
          const brandRef =  await db.collection(this.owner.city).doc(this.owner.shopId).collection('brand').doc()
          this.brand.createdAt = timestamp;
          this.brand.id = brandRef.id;
          brandRef.set(this.brand).then(()=>{
            this.brand.name='';
          }).catch(error=>{
            console.log(error.message)
          })
        }else {
          this.infoModalActive = true;
          this.modalMessage = this.$t('message.cate_already_exist')
        }

      }else {
        // this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = this.$t('message.enter_category')
      }
    },
    async uploadSize(){
      if(this.size.name!==''){
        let isSame = false;
        for(let i =0; i<this.sizes.length;i++){
          if(this.sizes[i].name.toLowerCase() === this.size.name.toLowerCase()){
            isSame = true;
            break;
          }else {
            isSame = false;
          }
        }
        if(!isSame){
          const sizeRef =  await db.collection(this.owner.city).doc(this.owner.shopId).collection('size').doc()
          this.size.createdAt = timestamp;
          this.size.id = sizeRef.id;
          sizeRef.set(this.size).then(()=>{
            this.size.name='';
          }).catch(error=>{
            console.log(error.message)
          })
        }else {
          this.infoModalActive = true;
          this.modalMessage = this.$t('message.cate_already_exist')
        }

      }else {
        // this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = this.$t('message.enter_category')
      }
    },
    async uploadColor(){
      if(this.color.name!==''){
        let isSame = false;
        for(let i =0; i<this.colors.length;i++){
          if(this.colors[i].name.toLowerCase() === this.color.name.toLowerCase()){
            isSame = true;
            break;
          }else {
            isSame = false;
          }
        }
        if(!isSame){
          const colorRef =  await db.collection(this.owner.city).doc(this.owner.shopId).collection('color').doc()
          this.color.createdAt = timestamp;
          this.color.id = colorRef.id;
          colorRef.set(this.color).then(()=>{
            this.color.name='';
          }).catch(error=>{
            console.log(error.message)
          })
        }else {
          this.infoModalActive = true;
          this.modalMessage = this.$t('message.cate_already_exist')
        }

      }else {
        // this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = this.$t('message.enter_category')
      }
    },
    async uploadWeight(){
      if(this.weight.name!==''){
        let isSame = false;
        for(let i =0; i<this.weights.length;i++){
          if(this.weights[i].name.toLowerCase() === this.weight.name.toLowerCase()){
            isSame = true;
            break;
          }else {
            isSame = false;
          }
        }
        if(!isSame){
          const weightRef =  await db.collection(this.owner.city).doc(this.owner.shopId).collection('weight').doc()
          this.weight.createdAt = timestamp;
          this.weight.id = weightRef.id;
          weightRef.set(this.weight).then(()=>{
            this.weight.name='';
          }).catch(error=>{
            console.log(error.message)
          })
        }else {
          this.infoModalActive = true;
          this.modalMessage = this.$t('message.cate_already_exist')
        }

      }else {
        // this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = this.$t('message.enter_category')
      }
    },
    async uploadKitchen(){
      if(this.kitchen.name!==''){
        let isSame = false;
        for(let i =0; i<this.kitchens.length;i++){
          if(this.kitchens[i].name.toLowerCase() === this.kitchen.name.toLowerCase()){
            isSame = true;
            break;
          }else {
            isSame = false;
          }
        }
        if(!isSame){
          const kitchenRef =  await db.collection(this.owner.city).doc(this.owner.shopId).collection('kitchens').doc()
          this.kitchen.createdAt = timestamp;
          this.kitchen.id = kitchenRef.id;
          kitchenRef.set(this.kitchen).then(()=>{
            this.kitchen.name='';
          }).catch(error=>{
            console.log(error.message)
          })
        }else {
          this.infoModalActive = true;
          this.modalMessage = this.$t('message.cate_already_exist')
        }

      }else {
        // this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = this.$t('message.enter_category')
      }
    },
    async uploadApartmentType(){
      if(this.apartmentType.name!==''){
        let isSame = false;
        for(let i =0; i<this.apartmentTypes.length;i++){
          if(this.apartmentTypes[i].name.toLowerCase() === this.apartmentType.name.toLowerCase()){
            isSame = true;
            break;
          }else {
            isSame = false;
          }
        }
        if(!isSame){
          const apartmentTypeRef =  await db.collection(this.owner.city).doc(this.owner.shopId).collection('apartmentTypes').doc()
          this.apartmentType.createdAt = timestamp;
          this.apartmentType.id = apartmentTypeRef.id;
          apartmentTypeRef.set(this.apartmentType).then(()=>{
            this.apartmentType.name='';
          }).catch(error=>{
            console.log(error.message)
          })
        }else {
          this.infoModalActive = true;
          this.modalMessage = this.$t('message.cate_already_exist')
        }

      }else {
        // this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = this.$t('message.enter_category')
      }
    },
    async uploadTableCategory(){
      if(this.tableCategory.name!==''){
        let isSame = false;
        for(let i =0; i<this.tableCategories.length;i++){
          if(this.tableCategories[i].name.toLowerCase() === this.tableCategory.name.toLowerCase()){
            isSame = true;
            break;
          }else {
            isSame = false;
          }
        }
        if(!isSame){
          const tableCategoryRef =  await db.collection(this.owner.city).doc(this.owner.shopId).collection('tableCategory').doc()
          this.tableCategory.id = tableCategoryRef.id;
          tableCategoryRef.set(this.tableCategory).then(()=>{
            this.tableCategory.name='';
          }).catch(error=>{
            console.log(error.message)
          })
        }else {
          this.infoModalActive = true;
          this.modalMessage = this.$t('message.cate_already_exist')
        }

      }else {
        // this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = this.$t('message.enter_category')
      }
    }

  }
}
</script>

<style scoped>
table{
  border: none !important;
}
td, th, tr{
  border: none !important;
  color: var(--text-color);
  margin-bottom: 4px;
}
thead, tbody{
  border: 1px solid var(--softPrimary) !important;
  color: var(--dark);
}
.modal-content{
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  color: var(--text-color);
}
.modal-header{
  border: 0;
}
.modal-footer{
  border: 0;
}
.table-box{
  padding-bottom: 50px;
  padding-top: 10px;
  height: 30vh;
  overflow-y: scroll;
}
.brand-box{
  padding-bottom: 50px;
  padding-top: 10px;
  height: 70vh;
  overflow-y: scroll;
}

@media only screen and (max-width: 1030px) {
  .content-box {
    margin-top: 90px;
  }
}
</style>