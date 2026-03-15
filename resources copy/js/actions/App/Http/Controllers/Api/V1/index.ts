import StatsController from './StatsController'
import DomainController from './DomainController'
import HostingPlanController from './HostingPlanController'
import GameserverCloudPlanController from './GameserverCloudPlanController'
import HostingServerController from './HostingServerController'
import PterodactylController from './PterodactylController'
import BrandController from './BrandController'
import PartnerController from './PartnerController'
const V1 = {
    StatsController: Object.assign(StatsController, StatsController),
DomainController: Object.assign(DomainController, DomainController),
HostingPlanController: Object.assign(HostingPlanController, HostingPlanController),
GameserverCloudPlanController: Object.assign(GameserverCloudPlanController, GameserverCloudPlanController),
HostingServerController: Object.assign(HostingServerController, HostingServerController),
PterodactylController: Object.assign(PterodactylController, PterodactylController),
BrandController: Object.assign(BrandController, BrandController),
PartnerController: Object.assign(PartnerController, PartnerController),
}

export default V1