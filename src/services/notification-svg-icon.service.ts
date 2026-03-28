import { Injectable } from '@angular/core';
import { TbxMatSvgIconService } from '@teqbench/tbx-mat-icons';
import {
    type ITbxSeverityResolver,
    TbxSeverityLevelType,
    tbxResolveSeverityIcon,
} from '@teqbench/tbx-mat-severity-icons';

/**
 * Default SVG-based notification icon service.
 *
 * Extends {@link TbxMatSvgIconService} for SVG icon registration and implements
 * {@link ITbxSeverityResolver} for severity-level icon mapping.
 *
 * This class provides the severity method implementations that return the
 * registered svgIcon names. Subclasses must call `this.register()` in their
 * constructor to register the actual SVG markup for each severity level.
 * The component binds the resolved name via `<mat-icon [svgIcon]="...">`.
 *
 * ### Examples
 *
 * @example Subclassing with custom SVG markup:
 * ```typescript
 * import { Injectable } from '@angular/core';
 * import { TbxMatNotificationSvgIconService } from '@teqbench/tbx-mat-notifications';
 * import { TbxSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
 *
 * @Injectable()
 * export class MyNotificationSvgIcons extends TbxMatNotificationSvgIconService {
 *     constructor() {
 *         super();
 *         this.register(TbxSeverityLevelType.Success, '<svg>...</svg>');
 *         this.register(TbxSeverityLevelType.Error, '<svg>...</svg>');
 *         this.register(TbxSeverityLevelType.Warning, '<svg>...</svg>');
 *         this.register(TbxSeverityLevelType.Information, '<svg>...</svg>');
 *         this.register(TbxSeverityLevelType.Help, '<svg>...</svg>');
 *     }
 * }
 * ```
 *
 * @example Registering in app.config.ts:
 * ```typescript
 * // app.config.ts
 * import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '@teqbench/tbx-mat-notifications';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new MyNotificationSvgIcons(),
 *         }),
 *     },
 * ]
 *
 * // Component — uses svgIcon binding:
 * // readonly config = inject(TBX_MAT_NOTIFICATION_PROVIDER_CONFIG);
 * // readonly severity = TbxSeverityLevelType.Success;
 * // <mat-icon [svgIcon]="config.severityIconResolverService.resolve(severity)!"></mat-icon>
 * ```
 */
@Injectable()
export class TbxMatNotificationSvgIconService
    extends TbxMatSvgIconService<TbxSeverityLevelType>
    implements ITbxSeverityResolver
{
    success(): string {
        return TbxSeverityLevelType.Success;
    }

    error(): string {
        return TbxSeverityLevelType.Error;
    }

    warning(): string {
        return TbxSeverityLevelType.Warning;
    }

    information(): string {
        return TbxSeverityLevelType.Information;
    }

    help(): string {
        return TbxSeverityLevelType.Help;
    }

    override resolve(name: TbxSeverityLevelType): string | undefined;
    override resolve(name: string): string | undefined;
    override resolve(name: string): string | undefined {
        return tbxResolveSeverityIcon(this, name);
    }
}
