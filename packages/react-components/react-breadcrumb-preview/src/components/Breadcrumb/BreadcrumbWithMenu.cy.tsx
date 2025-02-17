import * as React from 'react';
import { mount } from '@cypress/react';
import type {} from '@cypress/react';
import { FluentProvider } from '@fluentui/react-provider';
import { webLightTheme } from '@fluentui/react-theme';
import { MoreHorizontalRegular, MoreHorizontalFilled, bundleIcon } from '@fluentui/react-icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbLink,
  BreadcrumbDivider,
  partitionBreadcrumbItems,
} from '@fluentui/react-breadcrumb-preview';
import type { BreadcrumbProps, PartitionBreadcrumbItems } from '@fluentui/react-breadcrumb-preview';
import {
  Button,
  Menu,
  MenuList,
  MenuItemLink,
  MenuPopover,
  MenuTrigger,
  useIsOverflowItemVisible,
  useOverflowMenu,
  MenuItem,
} from '@fluentui/react-components';

const MoreHorizontal = bundleIcon(MoreHorizontalFilled, MoreHorizontalRegular);
const mountFluent = (element: JSX.Element) => {
  mount(<FluentProvider theme={webLightTheme}>{element}</FluentProvider>);
};

const mapHelper = new Array(7).fill(0).map((_, i) => i);

type Item = {
  key: number;
  id: string;
  item?: string;
  href?: string;
};

const OverflowMenu: React.FC<{ id: string; item: Item; link?: boolean }> = props => {
  const { item, id, link = false } = props;
  const isVisible = useIsOverflowItemVisible(id);

  if (isVisible) {
    return null;
  }

  return link ? (
    <MenuItemLink href={item.href || ''} id={item.id}>
      {item.item}
    </MenuItemLink>
  ) : (
    <MenuItem id={item.id}>{item.item}</MenuItem>
  );
};

function renderElement(el: Item, isLastItem: boolean = false, link: boolean = false) {
  return (
    <React.Fragment key={`link-items-${el.key}`}>
      <BreadcrumbItem>
        {link ? (
          <BreadcrumbLink target="_blank" current={isLastItem} id={el.id}>
            {el.item}
          </BreadcrumbLink>
        ) : (
          <BreadcrumbButton id={el.id} current={isLastItem}>
            {el.item}
          </BreadcrumbButton>
        )}
      </BreadcrumbItem>
      {!isLastItem && <BreadcrumbDivider />}
    </React.Fragment>
  );
}

const ControlledOverflowMenu = (props: PartitionBreadcrumbItems<Item>) => {
  const { overflowItems, startDisplayedItems, endDisplayedItems } = props;
  const { ref, isOverflowing, overflowCount } = useOverflowMenu<HTMLButtonElement>();

  if (!isOverflowing && overflowItems && overflowItems.length === 0) {
    return null;
  }

  return (
    <Menu hasIcons>
      <MenuTrigger disableButtonEnhancement>
        <Button
          id="menu"
          appearance="transparent"
          ref={ref}
          icon={<MoreHorizontal />}
          aria-label={`${overflowCount} more tabs`}
          role="tab"
        />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {isOverflowing &&
            startDisplayedItems.map((item: Item) => (
              <OverflowMenu id={item.key.toString()} item={item} key={item.key} />
            ))}
          {overflowItems && overflowItems.map((item: Item) => <OverflowMenu id={item.id} item={item} key={item.key} />)}
          {isOverflowing &&
            endDisplayedItems &&
            endDisplayedItems.map((item: Item) => <OverflowMenu id={item.id} item={item} key={item.key} />)}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

const ControlledOverflowMenuLink = (props: PartitionBreadcrumbItems<Item>) => {
  const { overflowItems, startDisplayedItems, endDisplayedItems } = props;
  const { ref, isOverflowing, overflowCount } = useOverflowMenu<HTMLButtonElement>();

  if (!isOverflowing && overflowItems && overflowItems.length === 0) {
    return null;
  }

  return (
    <Menu hasIcons>
      <MenuTrigger disableButtonEnhancement>
        <Button
          id="menu"
          appearance="transparent"
          ref={ref}
          icon={<MoreHorizontal />}
          aria-label={`${overflowCount} more tabs`}
          role="tab"
        />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {isOverflowing &&
            startDisplayedItems.map((item: Item) => <OverflowMenu id={item.id} item={item} key={item.key} link />)}
          {overflowItems &&
            overflowItems.map((item: Item) => <OverflowMenu id={item.id} item={item} key={item.key} link />)}
          {isOverflowing &&
            endDisplayedItems &&
            endDisplayedItems.map((item: Item) => <OverflowMenu id={item.id} item={item} key={item.key} link />)}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

const BreadcrumbSampleWithMenu = (props: BreadcrumbProps) => {
  const buttonItems = mapHelper.map(i => ({
    key: i,
    id: `breadcrumb-button-${i}`,
    item: `Item ${i}`,
  }));
  const { startDisplayedItems, overflowItems, endDisplayedItems }: PartitionBreadcrumbItems<Item> =
    partitionBreadcrumbItems({
      items: buttonItems,
      maxDisplayedItems: 4,
    });

  return (
    <>
      <p tabIndex={0} id="before">
        Before
      </p>
      <Breadcrumb {...props}>
        {startDisplayedItems.map((item: Item) => renderElement(item, false))}
        <ControlledOverflowMenu
          overflowItems={overflowItems}
          startDisplayedItems={startDisplayedItems}
          endDisplayedItems={endDisplayedItems}
        />
        <BreadcrumbDivider />
        {endDisplayedItems &&
          endDisplayedItems.map((item: Item) => {
            const isLastItem = item.key === buttonItems.length - 1;
            return renderElement(item, isLastItem);
          })}
      </Breadcrumb>
      <p tabIndex={0} id="after">
        After
      </p>
    </>
  );
};

const BreadcrumbLinkSampleWithMenu = (props: BreadcrumbProps) => {
  const linkItems = mapHelper.map(i => ({
    id: `breadcrumb-link-${i}`,
    key: i,
    item: `Item ${i}`,
  }));
  const { startDisplayedItems, overflowItems, endDisplayedItems }: PartitionBreadcrumbItems<Item> =
    partitionBreadcrumbItems({
      items: linkItems,
      maxDisplayedItems: 4,
    });

  return (
    <>
      <p tabIndex={0} id="before">
        Before
      </p>
      <Breadcrumb {...props}>
        {startDisplayedItems.map((item: Item) => renderElement(item, false, true))}
        <ControlledOverflowMenuLink
          overflowItems={overflowItems}
          startDisplayedItems={startDisplayedItems}
          endDisplayedItems={endDisplayedItems}
        />
        <BreadcrumbDivider />
        {endDisplayedItems &&
          endDisplayedItems.map((item: Item) => {
            const isLastItem = item.key === linkItems.length - 1;
            return renderElement(item, isLastItem, true);
          })}
      </Breadcrumb>
      <p tabIndex={0} id="after">
        After
      </p>
    </>
  );
};

describe('Breadcrumb with Overflow', () => {
  describe('focus behaviors for BreadcrumbButton with Menu', () => {
    describe('focusMode="tab"(default)', () => {
      it('should be focusable', () => {
        mountFluent(<BreadcrumbSampleWithMenu />);

        cy.get('#before').focus();

        cy.get('#breadcrumb-button-0').should('not.be.focused');

        cy.realPress('Tab');

        cy.get('#breadcrumb-button-0').should('be.focused');
        cy.realPress('Tab');
        cy.get('#menu').should('be.focused');
        cy.realPress('Enter');
        cy.get('#breadcrumb-button-1').should('be.focused');
        cy.realPress('ArrowDown');
        cy.get('#breadcrumb-button-2').should('be.focused');
        cy.realPress('ArrowDown');
        cy.get('#breadcrumb-button-3').should('be.focused');
        cy.realPress('ArrowDown');
        cy.get('#breadcrumb-button-1').should('be.focused');
        cy.realPress('Escape');
        cy.get('#menu').should('be.focused');
        cy.realPress('Tab');
        cy.get('#breadcrumb-button-4').should('be.focused');
        cy.realPress('Tab');
        cy.realPress('Tab');
        cy.realPress('Tab');
        cy.get('#after').focus();
      });
    });

    describe('focusMode="arrow"', () => {
      it('should be focusable', () => {
        mountFluent(<BreadcrumbSampleWithMenu focusMode="arrow" />);

        cy.get('#before').focus();

        cy.get('#breadcrumb-button-0').should('not.be.focused');

        cy.realPress('Tab');

        cy.get('#breadcrumb-button-0').should('be.focused');
        cy.realPress('ArrowRight');
        cy.get('#menu').should('be.focused');
        cy.realPress('Enter');
        cy.get('#breadcrumb-button-1').should('be.focused');
        cy.realPress('ArrowDown');
        cy.get('#breadcrumb-button-2').should('be.focused');
        cy.realPress('ArrowDown');
        cy.get('#breadcrumb-button-3').should('be.focused');
        cy.realPress('ArrowDown');
        cy.get('#breadcrumb-button-1').should('be.focused');
        cy.realPress('Escape');
        cy.get('#menu').should('be.focused');
        cy.realPress('ArrowRight');
        cy.get('#breadcrumb-button-4').should('be.focused');
        cy.realPress('ArrowRight');
        cy.realPress('ArrowRight');
        cy.realPress('ArrowRight');
        cy.get('#after').focus();
      });
    });
  });
  describe('focus behaviors for BreadcrumbLink with Menu', () => {
    describe('focusMode="tab"(default)', () => {
      it('should be focusable', () => {
        mountFluent(<BreadcrumbLinkSampleWithMenu />);

        cy.get('#before').focus();

        cy.get('#breadcrumb-link-0').should('not.be.focused');

        cy.realPress('Tab');

        cy.get('#breadcrumb-link-0').should('be.focused');
        cy.realPress('Tab');
        cy.get('#menu').should('be.focused');
        cy.realPress('Enter');
        cy.get('#breadcrumb-link-1').should('be.focused');
        cy.realPress('ArrowDown');
        cy.get('#breadcrumb-link-2').should('be.focused');
        cy.realPress('ArrowDown');
        cy.get('#breadcrumb-link-3').should('be.focused');
        cy.realPress('ArrowDown');
        cy.get('#breadcrumb-link-1').should('be.focused');
        cy.realPress('Escape');
        cy.get('#menu').should('be.focused');
        cy.realPress('Tab');
        cy.get('#breadcrumb-link-4').should('be.focused');
        cy.realPress('Tab');
        cy.realPress('Tab');
        cy.realPress('Tab');
        cy.get('#after').focus();
      });
    });

    describe('focusMode="arrow"', () => {
      it('should be focusable', () => {
        mountFluent(<BreadcrumbLinkSampleWithMenu focusMode="arrow" />);

        cy.get('#before').focus();

        cy.get('#breadcrumb-link-0').should('not.be.focused');

        cy.realPress('Tab');

        cy.get('#breadcrumb-link-0').should('be.focused');
        cy.realPress('ArrowRight');
        cy.get('#menu').should('be.focused');
        cy.realPress('Enter');
        cy.get('#breadcrumb-link-1').should('be.focused');
        cy.realPress('ArrowDown');
        cy.get('#breadcrumb-link-2').should('be.focused');
        cy.realPress('ArrowDown');
        cy.get('#breadcrumb-link-3').should('be.focused');
        cy.realPress('ArrowDown');
        cy.get('#breadcrumb-link-1').should('be.focused');
        cy.realPress('Escape');
        cy.get('#menu').should('be.focused');
        cy.realPress('ArrowRight');
        cy.get('#breadcrumb-link-4').should('be.focused');
        cy.realPress('ArrowRight');
        cy.realPress('ArrowRight');
        cy.realPress('ArrowRight');
        cy.get('#after').focus();
      });
    });
  });
});
